const commando = require("discord.js-commando");
const { reddit } = require("../../index");
const newEmbed = require("../../embed");
const { timestampToDate } = require("../../utils");

module.exports = class reddituser extends commando.Command {
    constructor(client) {
        super(client, {
            name: "reddituser",
            memberName: "reddituser",
            group: "fun",
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
            embed
                .setTitle(await user.subreddit.display_name.display_name_prefixed)
                .setURL("https://reddit.com" + await user.subreddit.display_name.url)
                .setDescription(await user.subreddit.display_name.public_description)
                .setThumbnail(await user.icon_img)
                .addField("Created", timestampToDate(await user.created, true), true)
                .addField("Reddit Premium", await user.is_gold, true)
                .setImage(await user.subreddit.display_name.banner_img);

            em.edit(embed);

            const editMsg = async function() {
                embed.setTitle(await user.subreddit.display_name.title);
                embed.footer.text += " - " + (await user.subreddit).display_name.display_name_prefixed;
                em.edit(embed);
            };

            if(await user.subreddit.display_name.title) editMsg();

            /* getModerators().then(mods => {
                msg.say(mods.map(mod => mod.name));
            }); */
        } catch(e) {
            embed
                .setColor("GOLD")
                .setDescription(`User /u/${cmd.user} not found`)
                .setFooter("");
            return em.edit(embed);
        }
    }
};
