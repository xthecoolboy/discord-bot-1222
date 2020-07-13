const commando = require("@iceprod/discord.js-commando");
const emojiRegex = require("emoji-regex");
const newEmbed = require("../../embed");
const { pieChart } = require("../../utils");
const emojis = emojiRegex();

const emojiFormat = (() => {
    return new RegExp("(?=" + emojis.source + "|<:[a-z0-9-_]+:[0-9]+>)", "gi");
})();

const emojiFormatMatching = (() => {
    return new RegExp(emojis.source + "|<:[a-z0-9-_]+:[0-9]+>", "gi");
})();

module.exports = class Poll extends commando.Command {
    constructor(client) {
        super(client, {
            name: "poll",
            memberName: "poll",
            group: "mod",
            description: "Create simple polls with Aztec.",
            args: [
                {
                    type: "string",
                    key: "title",
                    prompt: "what is the title of the poll?"
                },
                {
                    type: "string",
                    key: "args",
                    prompt: "what should be the options? Use format `<emoji> option`. Duplicates will be ignored.",
                    validate(val, msg, arg) {
                        return emojis.test(val) || /<:[a-z0-9_-]+:[0-9]+>/gi.test(val);
                    },
                    infinite: true
                }
            ]
        });
    }

    async run(msg, { title, args }) {
        await msg.author.fetchUser();
        args = args.join("").split(emojiFormat).map(val => {
            var emoji = val.match(emojiFormatMatching)[0];
            var data = val.replace(emoji, "");
            return {
                emoji,
                data: data.trim()
            };
        });

        args = args.filter((val, i, self) => self.indexOf(val) === i);

        if(!args.length) {
            return msg.reply("Cannot send empty poll");
        }

        var embed = newEmbed();
        embed.setTitle(title || "Poll");
        embed.setDescription("React with one of the following:\n" +
            args.map(val => val.emoji + ": " + val.data).join("\n"));

        var labels = args.map(val => val.data);
        var values = (new Array(labels.length)).fill(0);

        embed.setImage(pieChart(labels, values));

        var m = await msg.channel.send(embed);
        for(const arg of args) {
            try {
                await m.react(arg.emoji);
            } catch(e) {
                try {
                    await m.react(arg.emoji.match(/[0-9]+/)[0]);
                } catch(e) {
                    embed.footer.text += " | Poll ended";
                    await m.edit(embed);
                    return msg.reply("Cannot use cross server emojis. Poll ended.");
                }
            }
        }
        const collector = m.createReactionCollector((r, u) => !u.bot, { time: (msg.author.donor_tier > 0 ? 120 * 60e3 : 30 * 60e3), dispose: true });
        collector.on("collect", async (r, u) => {
            if(!r.me) {
                return r.remove();
            }
            var i = -1;
            for(var arg in args) {
                if(args[arg].emoji === "<:" + r.emoji.identifier + ">" || args[arg].emoji === r.emoji.name) {
                    i = arg;
                    break;
                }
            }
            if(!~i) return r.remove();
            values[i] += 1;
            embed.setImage(pieChart(labels, values));
            await m.edit(embed);
        });
        collector.on("remove", async (r, u) => {
            var i = -1;
            for(var arg in args) {
                if(args[arg].emoji === "<:" + r.emoji.identifier + ">" || args[arg].emoji === r.emoji.name) {
                    i = arg;
                    break;
                }
            }
            if(!~i) return r.remove();
            values[i] -= 1;
            embed.setImage(pieChart(labels, values));
            await m.edit(embed);
        });
        collector.on("end", async c => {
            embed.footer.text += " | Poll ended";
            await m.edit(embed);
        });
    }
};
