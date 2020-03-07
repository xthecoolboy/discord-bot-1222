const Discord = require('discord.js');
const newEmbed = require("../../embed");

class Invite {
    getName() {
        return "invite";
    }
    getDesc() {
        return "Link to invite me to your server";
    }
    exec(cmd, client, msg) {
        const inviteURL = "https://discordapp.com/api/oauth2/authorize?client_id=654725534365909043&permissions=8&scope=bot";
        msg.channel.send(inviteURL);
        //msg.channel.send("To be done");
    }
}

module.exports = new Invite;