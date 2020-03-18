const Discord = require('discord.js');
const newEmbed = require("../../embed");

class Invite {
    getName() {
        return "leetify";
    }
    getAliases(){
        return ["leet"];
    }
    getDesc() {
        return "Leetify your text";
    }
    /**
     * 
     * @param {String} str 
     */
    leet(str){
        str = str
            .replace(/e/gi, 3)
            .replace(/t/gi, 7)
            .replace(/o/gi, 0)
            .replace(/i/gi, 1)
            .replace(/a/gi, 4)
            .replace(/h/g, "H")
            .replace(/u/g, "U")
            .replace(/k/g, "K")
            .replace(/m/g, "M");
        return str;
    }
    exec(cmd, client, msg) {
        cmd.shift();
        if (!cmd[0]) {
            msg.channel.send("Pass some text here. (Use this command as `ice leetify <text>`)");
            return;
        }
        msg.channel.send(this.leet(cmd.join(" ")));
    }
}

module.exports = new Invite;