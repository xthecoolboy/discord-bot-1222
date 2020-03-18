const Discord = require('discord.js');
const newEmbed = require("../../embed");

class Invite {
    getName() {
        return "cool";
    }
    getDesc() {
        return "Cool up something";
    }
    exec(cmd, client, msg) {
        cmd.shift();
        var text = cmd.join(" ");

        msg.channel.send("Cooling up " + text);
    }
}

module.exports = new Invite;