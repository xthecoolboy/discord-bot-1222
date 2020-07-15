const { Command } = require("@iceprod/discord.js-commando");
const newEmbed = require("../../embed");

module.exports = class historyCommand extends Command {
    constructor(client) {
        super(client, {
            name: "history",
            group: "mod",
            memberName: "history",
            description: "Shows on offenders history",
            guildOnly: true,
            args: [
                {
                    type: "user",
                    key: "user",
                    prompt: "which users offense history do you want to view?"
                }
            ]
        });
    }

    async run(msg, cmd) {
        const iterableObj = {
            [Symbol.asyncIterator]: () => {
                var current = 0;
                return {
                    async next() {
                        current++;
                        var data = await msg.guild.settings.get("case." + current, null);
                        if(!data) {
                            return { value: null, done: true };
                        }
                        return { value: data, done: false };
                    }
                };
            }
        };

        const embed = newEmbed();
        embed.setAuthor(msg.author.username, msg.author.displayAvatarURL());
        embed.setTitle(`${cmd.user.tag}'s offense history`);

        for await(var Case of iterableObj) {
            if(Case.offenderID === cmd.user.id) {
                var hasOffense = true;
                let removedText = "";
                if(Case.removed) removedText = "**[REMOVED]**";

                embed.addField(`${Case.type} | Case ${Case.id} ${removedText}`, `Reason: ${Case.reason}\nMod: ${Case.moderator}\n`
                );
            }
        }

        if(!hasOffense) return msg.say(`User ${cmd.user.tag} has no offense history. Good boy :smile:`);

        return msg.embed(embed);
    }
};
