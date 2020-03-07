const Discord = require('discord.js');
const newEmbed = require("../../embed");

class Invite {
    getName() {
        return "clap";
    }
    getDesc() {
        return "Emphasize your text with claps";
    }
    exec(cmd, client, msg) {
        cmd.shift();
        if(!cmd[0]){
            msg.channel.send("Pass some text here. (Use this command as `ice clap <text>`)");
            return;
        }
        msg.channel.send(cmd.join("👏"));
    }
}

module.exports = new Invite;