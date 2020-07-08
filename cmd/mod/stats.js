const newEmbed = require("../../embed");
const commando = require("@iceprod/discord.js-commando");
const moment = require("moment");

const { shortNumber } = require("../../utils");

global.started = new Date();

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
            embed.setURL("https://aztec.bot");

            embed.setThumbnail(this.client.user.avatarURL());
            var users = 0;
            var guilds = 0;
            for(const guild of this.client.guilds.cache) {
                guilds++;
                users += guild[1].memberCount;
            }

            embed.addField("Website", "[aztec.bot](https://aztec.bot)", true);
            embed.addField("Main guild", "[Aztec support](https://discord.gg/8fqEepV)", true);
            embed.addField("Prefix", "`" + msg.guild.commandPrefix + "`", true);
            embed.addField("Users", shortNumber(users), true);
            embed.addField("Guilds", shortNumber(guilds), true);
            embed.addField("Last restart", moment(global.started).fromNow(), true);
            msg.channel.send(embed);
        } catch(e) {
            msg.channel.send("An error occured.");
            console.warn(e);
        }
    }
};
