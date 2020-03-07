const Discord = require('discord.js');
const newEmbed = require("../../embed");
const cowsay = require("cowsay");

class Invite {
    getName() {
        return "cowsay";
    }
    getAliases(){
        return ["cowthink"];
    }
    getDesc() {
        return "Ascii cow saying whatever you want";
    }
    exec(cmd, client, msg) {
        var saying = cmd[0] == "cowsay";
        console.log(cmd);
        cmd.shift();
        var text = cmd.join(" ");
        console.log(text);
        if(saying){
            msg.channel.send("```\n" + cowsay.say({text}) + "\n```");
        } else {
            msg.channel.send("```\n" + cowsay.think({text}) + "\n```");
        }
    }
}

module.exports = new Invite;