const newEmbed = require("../../embed");
const commando = require("discord.js-commando");
const TimeAgo = require('javascript-time-ago');
const timeAgo = new TimeAgo('en-US')

const {shortNumber} = require("../../utils");

global.started = new Date;
global.lastReload = new Date;

module.exports = class Stats extends commando.Command {
    constructor(client){
        super(client, {
            name: "stats",
            memberName: "stats",
            group: "mod",
            description: "Statistics and information about ice",
            aliases: ["statistics"]
        });
    }
    shardRewrite = true;//future use as reminder to be rewrited in sharding
    async run(msg) {
        console.log("Stats");
        try {
            var embed = newEmbed();
            embed.setTitle("Ice");
            embed.setDescription("The most universal bot.");
            embed.setURL("http://ice.danbulant.eu");

            embed.setThumbnail(this.client.user.avatarURL);
            var users = 0;
            var guilds = 0;
            for(const guild of this.client.guilds){
                guilds++;
                users += guild[1].memberCount;
            }
            
            embed.addField("Website", "[ice.danbulant.eu](http://ice.danbulant.eu)", true);
            embed.addField("Main guild", "[DANBULANT](https://discord.gg/dZtq4Qu)", true);
            embed.addField("Prefix", "`ice `", true);
            embed.addField("Users", shortNumber(users), true);
            embed.addField("Guilds", shortNumber(guilds), true);
            embed.addField("Uptime", timeAgo.format(global.started), true);
            embed.addField("Last reloaded", timeAgo.format(global.lastReload), true);
            
            embed.setFooter("Ice, made by TechmandanCZ#0135", this.client.user.avatarURL);
            msg.channel.send(embed);
        } catch(e){
            msg.channel.send("An error occured.");
            console.warn(e);
        }
    }
}