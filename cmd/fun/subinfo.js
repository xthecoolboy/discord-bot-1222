const commando = require("@iceprod/discord.js-commando");
const { reddit } = require("../../index");
const newEmbed = require("../../embed");
const { timestampToDate } = require("../../utils");

module.exports = class subinfo extends commando.Command {
    constructor(client) {
        super(client, {
            name: "subinfo",
            memberName: "subinfo",
            group: "fun",
            aliases: ["sub"],
            description: "Fetch information about a subreddit",
            args: [
                {
                    type: "string",
                    key: "sub",
                    prompt: "which subreddit to fetch info from?",
                    default: "random"
                }
            ]
        });
    }

    async run(msg, cmd) {
        if(!reddit) return msg.say("Reddit connection not sucessful. View console for more information.");
        if(!cmd.sub.match(/^\/?(r\/)?[a-z0-9][a-z0-9_]{2,21}$/i)) return msg.say("Invalid subreddit name");
        const embed = newEmbed()
            .setDescription("Loading...");
        var em = await msg.say(embed);
        try {
            const sub = await reddit.getSubreddit(cmd.sub);
            if(await sub.over18 && !msg.channel.nsfw) {
                embed
                    .setDescription("NSFW subreddits are not allow in non-NSFW channels!")
                    .setColor("RED")
                    .setFooter("");
                return em.edit(embed);
            };
            embed
                .setTitle(await sub.display_name_prefixed)
                .setURL("https://reddit.com" + await sub.url)
                .setDescription(await sub.public_description)
                .setThumbnail(await sub.icon_img)
                .addField("Subscribers", (await sub.subscribers).withCommas(), true)
                .setImage(await sub.banner_img)
                .addField("Created", timestampToDate(await sub.created, true), true)
                .setFooter(await sub.title);

            em.edit(embed);

            /* getModerators().then(mods => {
                msg.say(mods.map(mod => mod.name));
            }); */
        } catch(e) {
            em.delete();
            if(e instanceof TypeError) return msg.say("Subreddit not found");
            try {
                if(e.error.reason === "private") return msg.say("This subreddit is private");
                else if(e.error.reason === "banned") return msg.say("This subreddit is banned");
                else if(e.error.reason === "quarantined") return msg.say("This subreddit is quarantined");
            } catch(e) {}
            console.error(e);
            return msg.say("Something went horribly wrong! Please try again later.");
        }
    }
};
