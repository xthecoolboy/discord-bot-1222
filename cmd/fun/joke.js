const commando = require('discord.js-commando');
const newEmbed = require("../../embed");

const got = require('got');

module.exports = class Joke extends commando.Command {
    constructor(client){
        super(client, {
            name: "joke",
            memberName: "joke",
            description: "Shows random joke",
            group: "fun",
            usage: "joke [type]",
            args: [
                {
                    type: "string",
                    key: "type",
                    default: "random",
                    prompt: "Which type of joke you want to see?"
                }
            ]
        })
    }
    run(msg, cmd) {
        let basePath = "http://jokes.guyliangilsing.me/retrieveJokes.php?type=";
        got(basePath + cmd.type).then(res => {
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