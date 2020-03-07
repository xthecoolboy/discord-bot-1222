const newEmbed = require("../../embed");

const TimeAgo = require('javascript-time-ago');
const timeAgo = new TimeAgo('en-US')

const {shortNumber} = require("../../utils");

class Invite {
    shardRewrite = true;//future use as reminder to be rewrited in sharding
    getName() {
        return "stats";
    }
    getAliases() {
        return ["statistics"];
    }
    getDesc() {
        return "Information about Ice + statistics.";
    }
    async exec(cmd, client, msg) {
        cmd.shift();
        this.msg = msg;

        var embed = newEmbed();
        embed.setTitle("Ice");
        embed.setDescription("The most universal bot.");
        embed.setURL("http://ice.danbulant.eu");
        embed.setThumbnail(client.user.avatarURL);
        var users = 0;
        var guilds = 0;
        for(const guild of client.guilds){
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

        embed.setFooter("Ice, made by TechmandanCZ#0135", client.user.avatarURL);
        msg.channel.send(embed);
    }
}

module.exports = new Invite;