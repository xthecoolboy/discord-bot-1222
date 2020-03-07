const Discord = require('discord.js');
const newEmbed = require("../../embed");

class Invite {
    getName() {
        return "google";
    }
    getDesc() {
        return "Shows link to search on google";
    }
    exec(cmd, client, msg) {
        cmd.shift()
        var query = cmd.join("+");
        const search = "https://www.google.com/search?q=" + query;
        msg.channel.send(search);
        msg.delete();
    }
}

module.exports = new Invite;