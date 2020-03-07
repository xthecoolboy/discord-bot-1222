const Discord = require('discord.js');
const newEmbed = require("../../embed");

class Pomoc {
    getName(){
        return "help";
    }
    getDesc(){
        return "Shows this help";
    }
    exec(cmd, client, msg){
        return "special::help";
    }
}

module.exports = new Pomoc;