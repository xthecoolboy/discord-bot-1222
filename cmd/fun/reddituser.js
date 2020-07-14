const commando = require("@iceprod/discord.js-commando");
const { reddit } = require("../../index");
const newEmbed = require("../../embed");
const { timestampToDate } = require("../../utils");
const pages = require("../../managers/pages");
const got = require("got");

module.exports = class reddituser extends commando.Command {
    constructor(client) {
        super(client, {
            name: "reddituser",
            memberName: "reddituser",
            group: "fun",
            aliases: ["ru"],
            description: "Fetch information about a reddit user",
            args: [
                {
                    type: "string",
                    key: "user",
                    prompt: "which reddit user to fetch info from?"
                }
            ]
        });
    }

    async run(msg, cmd) {
        // return msg.say("This command is disabled until it's fixed.");
        if(!reddit) return msg.say("Reddit connection not sucessful. View console for more information.");
        if(!cmd.user.match(/^\/?(u\/)?[a-z0-9][a-z0-9_-]{2,21}$/i)) return msg.say("Invalid username");
        const embed = newEmbed()
            .setDescription("Loading...");
        var em = await msg.say(embed);
        try {
            const user = await reddit.getUser(cmd.user);
            if(await user.over_18 && !msg.channel.nsfw) {
                embed
                    .setDescription("NSFW users are not allow in non-NSFW channels!")
                    .setColor("RED")
                    .setFooter("");
                return em.edit(embed);
            };
            const usub = await user.subreddit.display_name;
            embed
                .setTitle(usub.display_name_prefixed)
                .setURL("https://reddit.com" + usub.url)
                .setDescription(usub.public_description)
                .setThumbnail(usub.icon_img)
                .addField("Created", timestampToDate(await user.created, true), true)
                .addField("Karma", `${(await user.link_karma).withCommas()} / ${(await user.comment_karma).withCommas()}`, true)
                .addField("Reddit Premium", await user.is_gold, true)
                .setImage(usub.banner_img);

            if(await user.subreddit.display_name.title) {
                embed.setTitle(await user.subreddit.display_name.title);
                embed.footer.text += " - " + (await user.subreddit).display_name.display_name_prefixed;
            };

            let moderates = await got(`https://www.reddit.com/user/${cmd.user}/moderated_subreddits.json`, {
                responseType: "json",
                resolveBodyOnly: true
            });
            moderates = moderates.data;
            if(moderates) {
                embed.addField("Moderates", `${moderates.length} subreddits`, true);
                let subcount = 0;
                for(let i = 0; i < moderates.length; i++) subcount += moderates[i].subscribers;
                embed.addField("Total subscribers", `${subcount.withCommas()} (avg. ${Math.round(subcount / moderates.length).withCommas()})`, true);
                em.edit(embed);
                msg.say(`Display ${usub.display_name_prefixed}'s top moderated subreddits?`)
                    .then(async question => {
                        await question.react("✅");
                        await question.react("❌");

                        const filter = (reaction, user) => user.id === msg.author.id;
                        const collector = question.createReactionCollector(filter, { time: 15000 });
                        collector.on("collect", (reaction) => {
                            switch(reaction.emoji.name) {
                                case "❌":
                                    collector.stop();
                                    break;
                                case "✅":
                                    embed.addField("Top subreddits");
                                    collector.stop();
                                    pages(msg, embed, em, moderates, 1, "subreddits", sub => `[${sub.sr_display_name_prefixed}](https://reddit.com${sub.url}) (${sub.subscribers})`);
                                    break;
                                default:
                                    reaction.remove();
                            }
                        });
                        collector.on("end", collected => {
                            question.delete();
                        });
                    });
            } else em.edit(embed);
        } catch(e) {
            embed
                .setColor("GOLD")
                .setDescription(`User /u/${cmd.user} not found`)
                .setFooter("");
            return em.edit(embed);
        }
    }
};
