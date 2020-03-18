const Discord = require('discord.js');
const newEmbed = require("../../embed");
const randomPuppy = require('../../reddit');

class Ping {
    getName() {
        return "ping";
    }
    getDesc() {
        return "Shows bots response speed";
    }
    exec(cmd, client, msg) {
        var init = newEmbed();
        init.setTitle("Ping...");
        msg.channel.send(init).then(m => {
            let ping = m.createdTimestamp - msg.createdTimestamp;
            var embed = newEmbed();
            embed.setTitle("PONG!");
            embed.addField("Latency:", ping + "ms");
            embed.addField("API Latency:", client.ping + "ms");
            m.edit(embed);
        })
    }
}

module.exports = new Ping;