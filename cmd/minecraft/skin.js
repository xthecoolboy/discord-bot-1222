const commando = require("discord.js-commando");
const newEmbed = require("../../embed");

const got = require("got");

module.exports = class Skin extends commando.Command {
    constructor (client) {
        super(client, {
            name: "skin",
            memberName: "skin",
            group: "minecraft",
            description: "Shows skin of given user",
            args: [
                {
                    key: "username",
                    prompt: "Enter username of the minecraft player to show skin of:",
                    type: "string"
                }
            ]
        });
    }

    async run (msg, cmd) {
        var embed = newEmbed();
        var username = cmd.username;

        got(`https://api.mojang.com/users/profiles/minecraft/${username}`).then(res => {
            var obj = JSON.parse(res.body);
            embed.setImage(`https://crafatar.com/renders/body/${obj.id}.png?overlay`);
            embed.setTitle(obj.name);
            msg.channel.send(embed);
        }).catch((e) => {
            console.log(e);
            msg.channel.send("An error occured. Does this minecraft account exist?");
        });
    }
};
