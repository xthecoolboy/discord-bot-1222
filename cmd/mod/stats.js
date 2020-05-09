const newEmbed = require("../../embed");
const commando = require("@iceprod/discord.js-commando");
const TimeAgo = require("javascript-time-ago");
const timeAgo = new TimeAgo("en-US");

const { shortNumber } = require("../../utils");

global.started = new Date();
global.lastReload = new Date();

module.exports = class Stats extends commando.Command {
    constructor(client) {
        super(client, {
            name: "stats",
            memberName: "stats",
            group: "mod",
            description: "Statistics and information about ice",
            aliases: ["statistics", "about"]
        });
    }

    async run(msg) {
        console.log("Stats");
        try {
            var embed = newEmbed();
            embed.setTitle("Aztec");
            embed.setDescription("The most universal bot.");
            embed.setURL("https://iceproductions.dev");

            embed.setThumbnail(this.client.user.avatarURL());
            var users = 0;
            var guilds = 0;
            for(const guild of this.client.guilds.cache) {
                guilds++;
                users += guild[1].memberCount;
            }

            embed.addField("Website", "[iceproductions.dev](https://iceproductions.dev)", true);
            embed.addField("Main guild", "[Aztec support](https://discord.gg/8fqEepV)", true);
            embed.addField("Prefix", "`" + msg.guild.commandPrefix + "`", true);
            embed.addField("Users", shortNumber(users), true);
            embed.addField("Guilds", shortNumber(guilds), true);
            embed.addField("Uptime", timeAgo.format(global.started), true);
            // embed.addField("Last reloaded", timeAgo.format(global.lastReload), true);
            msg.channel.send(embed);
        } catch(e) {
            msg.channel.send("An error occured.");
            console.warn(e);
        }
    }
};
