const commando = require("discord.js-commando");
const { RichEmbed } = require("discord.js");

module.exports = class Announce extends commando.Command {
    constructor(client) {
        super(client, {
            name: "announce",
            memberName: "announce",
            aliases: ["announcement"],
            group: "mod",
            permissions: ["ADMINISTRATOR"],
            description: "Make the bot announce what you want.",
            args: [
                {
                    type: "string",
                    key: "title",
                    prompt: "What's the title of announcement?"
                }, {
                    type: "string",
                    key: "string",
                    prompt: "What do you want to announce?"
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
        var embed = new RichEmbed();

        if(cmd.showAuthor) {
            embed.setAuthor(msg.author.tag, msg.author.avatarURL);
        }
        embed.setTitle(cmd.title);
        embed.setDescription(cmd.string);

        msg.channel.send("", { embed });
    }
};
