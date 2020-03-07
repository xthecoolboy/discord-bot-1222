const Discord = require('discord.js');
const newEmbed = require("../../embed");
const Nekos = require('nekos.life');
const neko = new Nekos().nsfw;
const donors = require("../../donors");

class Invite {
    getName() {
        return "premium";
    }
    getDesc() {
        return "Information about premium.";
    }
    async exec(cmd, client, msg) {
        cmd.shift();
        this.msg = msg;

        if (!donors.includes(msg.author.id)) {
            msg.channel.send("You don't have premium. For information to get premium, go to http://ice.danbulant.eu/premium");
            return;
        }
        msg.channel.send("Congratulations! You have premium. Try some premium commands!");
    }
}

module.exports = new Invite;