const commando = require("@iceprod/discord.js-commando");
const newEmbed = require("../../embed");

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
                },
                {
                    type: "string",
                    key: "string",
                    prompt: "What do you want to announce?"
                },
                {
                    type: "string",
                    key: "color",
                    default: "000",
                    prompt: "What's the color you want to use?"
                },
                {
                    type: "boolean",
                    key: "showAuthor",
                    default: false,
                    prompt: "Do you want to show you as author?"
                }
            ]
        });
    }

    run(msg, cmd) {
        var embed = newEmbed()
            .setTitle(cmd.title)
            .setDescription(cmd.string)
            .setColor(cmd.color.toUpperCase())
            .setFooter("");

        if(cmd.showAuthor) embed.setAuthor(msg.author.tag, msg.authoravatarURL());

        msg.channel.send(embed);
    }
};
