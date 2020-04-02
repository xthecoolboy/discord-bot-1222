const commando = require("discord.js-commando");
const newEmbed = require("../../embed");

module.exports = class Logme extends commando.Command {
    constructor(client) {
        super(client, {
            name: "logme",
            memberName: "logme",
            group: "dev",
            description: "Shows properties of sent image",
            args: [
                {
                    type: "string",
                    key: "argument",
                    default: "",
                    prompt: "string :)"
                }
            ]
        });
    }

    run(msg, cmd) {
        var embed = newEmbed();
        embed.setTitle("Log");
        embed.addField("Command", "```json\n" + JSON.stringify(cmd, null, 2) + "\n```");
        var message = {};
        message.id = msg.id;
        message.author = {};
        message.author.id = msg.author.id;
        message.author.username = msg.author.username;
        message.url = msg.url;
        message.content = msg.content;
        message.channel = {};
        message.channel.id = msg.channel.id;
        message.channel.name = msg.channel.name;
        message.channel.type = msg.channel.type;
        embed.addField("Message", "```json\n" + JSON.stringify(message, null, 2) + "\n```");
        msg.channel.send(embed);
    }
};
