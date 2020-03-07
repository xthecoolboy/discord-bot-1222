const Discord = require('discord.js');
const newEmbed = require("../../embed");
const randomPuppy = require('../../reddit');

class News {
    disabled = true;
    getName() {
        return "noviny";
    }
    getDesc() {
        return "Zobrazí aktuální novinové články";
    }
    exec(cmd, client, msg) {
        msg.channel.send("Hej Ester, co je nového?");
    }
}

module.exports = new News;