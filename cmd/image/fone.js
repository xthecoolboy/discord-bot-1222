const Discord = require('discord.js');
const newEmbed = require("../../embed");

const got = require('got');

class Joke {
    getName() {
        return "fone";
    }
    getDesc() {
        return "Shows random image from Happy Fone";
    }
    exec(cmd, client, msg) {
        let basePath = "https://happy-fone-api.glitch.me/";
        let type = "cat";
        if (cmd[1]) type = cmd[1];
        if(type == "nude"){
            if (!msg.channel.nsfw && msg.channel.type != "dm") {
                msg.channel.send("This type is available only inside NSFW or DM channels!");
                return;
            }
        }
        got(basePath + type).then(res => {
            let r = JSON.parse(res.body);
            let e = newEmbed();
            e.setTitle(type + " for you");
            e.setImage(r.image);
            msg.channel.send(e);
        }).catch(e => {
            console.log(e);
            msg.channel.send("Cannot get image from Happy Fone.");
        });
    }
}

module.exports = new Joke;