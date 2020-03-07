const Discord = require('discord.js');
const newEmbed = require("../../embed");
const tick = ":white_check_mark:";
const cross = ":x:";

class LogMe {
    getName() {
        return "logme";
    }
    getDesc() {
        return "Logs this message to console";
    }
    exec(cmd, client, msg) {
        var embed = newEmbed();
        if (msg.member.id != 147365975707090944) {
            embed.setTitle("Log");
            embed.addField("Blocked", "Due to abuse by _some people_, command logme is now disabled for non-admins of Ice");
            msg.channel.send(embed);
            return;
        }
        embed.setTitle("Log");
        embed.addField("Command", "```json\n" + JSON.stringify(cmd, null, 2) + "\n```");
        var message = {};
        message.id = msg.id;
        message.author = {};
        message.author.id = msg.author.id;
        message.author.username = msg.author.username;        
        message.url = msg.url;
        message.content = msg.content;
        message.channel = {};
        message.channel.id = msg.channel.id;
        message.channel.name = msg.channel.name;
        embed.addField("Message", "```json\n" + JSON.stringify(message, null, 2) + "\n```");
        console.log(cmd);
        console.log(msg);
        msg.channel.send(embed);
    }
}

module.exports = new LogMe;