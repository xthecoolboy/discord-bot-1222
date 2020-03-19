const commando = require('discord.js-commando');
const newEmbed = require("../../embed");

const got = require('got');

module.exports = class Fone extends commando.Command{
    constructor(client){
        super(client, {
            name: "fone",
            memberName: "fone",
            group: "image",
            description: "Shows random image from happy fone api",
            args: [
                {
                    default: "cat",
                    prompt: "Enter type of resource",
                    key: "type",
                    type: "string"
                }
            ]
        })
    }
    async run(msg, cmd) {
        let basePath = "https://happy-fone-api.glitch.me/";
        let type = "cat";
        if (cmd.type) type = cmd.type;
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