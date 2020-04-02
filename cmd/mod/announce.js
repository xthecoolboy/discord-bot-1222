const commando = require("discord.js-commando");
const { Embed } = require("discord.js");

module.exports = class Announce extends commando.Command {
    constructor(client) {
        super(client, {
            name: "announce",
            memberName: "announce",
            aliases: ["announcement"],
            group: "mod",
            permissions: ["ADMINISTRATOR"],
            description: "Make the bot announce what you want. Remember to wrap it in quotes, as the second parameter is if you want to be shown as author.",
            args: [
                {
                    type: "string",
                    key: "string",
                    prompt: "What do you want bot to say?"
                }, {
                    type: "boolean",
                    key: "showAuthor",
                    default: true,
                    prompt: "Do you want to show you as author?"
                }
            ]
        });
    }

    run(msg, cmd) {
        var embed = new Embed();

        if(cmd.showAuthor) {
            embed.setAuthor(msg.author.tag, msg.author.avatarURL);
        }

        embed.setDescription(cmd.string);

        msg.channel.send("", { embed });
    }
};
