const commando = require("@iceprod/discord.js-commando");
const { reddit } = require("../../index");
const newEmbed = require("../../embed");
const { numberWithCommas, timestampToDate } = require("../../utils");
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
                .addField("Karma", `${numberWithCommas(await user.link_karma)} / ${numberWithCommas(await user.comment_karma)}`, true)
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
                embed.addField("Total subscribers", `${numberWithCommas(subcount)} (avg. ${numberWithCommas(Math.round(subcount / moderates.length))})`, true);
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
                                    pages(msg, cmd, embed, em, moderates, 1);
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
            console.log(e);
            return em.edit(embed);
        }

        async function pages(msg, cmd, embed, em, moderates, pagenumber) {
            const moddedSubs = embed.fields[embed.fields.length - 1];
            moddedSubs.value = "";
            for(let i = 10 * (pagenumber - 1); i < 10 * pagenumber; i++) {
                if(moderates[i]) moddedSubs.value += `**${i + 1}.** ${moderates[i].sr_display_name_prefixed} (${numberWithCommas(moderates[i].subscribers)})\n`;
            }
            if(moderates.length > 10) {
                embed.fields[embed.fields.length - 1].name = `Top subreddits (Page ${pagenumber})`;
            }
            em.edit(embed);

            if(moderates.length > 10) {
                const filter = (reaction, user) => user.id === msg.author.id;
                const collector = em.createReactionCollector(filter, { time: 15000 });
                await em.react("⬅");
                if(moderates.length >= pagenumber * 10) em.react("➡");
                collector.on("collect", async (reaction) => {
                    switch(reaction.emoji.name) {
                        case "⬅":
                            await reaction.remove(msg.author.id);
                            if(pagenumber === 1) return;
                            collector.endReason = "Reaction";
                            collector.stop();
                            pages(msg, cmd, embed, em, moderates, pagenumber - 1);
                            break;
                        case "➡":
                            await reaction.remove(msg.author.id);
                            if(moderates.length <= (pagenumber + 1) * 10)await reaction.remove();
                            collector.endReason = "Reaction";
                            collector.stop(reaction.user);
                            pages(msg, cmd, embed, em, moderates, pagenumber + 1);
                            break;
                    }
                });
                collector.on("end", collected => {
                    if(collector.endReason !== "Reaction") em.reactions.forEach(reaction => reaction.remove());
                });
            }
        }
    }
};
