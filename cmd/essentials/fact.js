const got = require('got');
const commando = require("discord.js-commando");

module.exports = class Fact extends commando.Command {
    constructor(client){
        super(client, {
            name: "fact",
            memberName: "fact",
            group: "essentials",
            description: "Shows random useless fact"
        });
    }
    run(msg) {
        got("https://uselessfacts.jsph.pl/random.json?language=en").then(response => {
            var obj = JSON.parse(response.body);
            msg.channel.send(obj.text);
        });
    }
}