const Discord = require('discord.js');
const newEmbed = require("../../embed");

const got = require('got');

class Joke {
    getName() {
        return "joke";
    }
    getDesc() {
        return "Shows random joke";
    }
    exec(cmd, client, msg) {
        let basePath = "http://jokes.guyliangilsing.me/retrieveJokes.php?type=";
        let type = "random";
        if(cmd[1]) type = cmd[1];
        got(basePath + type).then(res => {
            let r = JSON.parse(res.body);
            if(r.status != 200)throw Error;
            let e = newEmbed();
            e.setTitle(r.type.substr(0, r.type.length - 2));
            e.setDescription(r.joke);
            msg.channel.send(e);
        }).catch(e => {
            msg.channel.send("Couldn't find any joke of that type.");
        });
    }
}

module.exports = new Joke;