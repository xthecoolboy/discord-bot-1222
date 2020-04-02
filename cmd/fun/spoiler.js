const commando = require("discord.js-commando");

module.exports = class Spoiler extends commando.Command {
    constructor(client) {
        super(client, {
            name: "spoiler",
            memberName: "spoiler",
            aliases: ["spoil"],
            group: "fun",
            description: "Make the bot say something in annoying spoilers",
            args: [
                {
                    type: "string",
                    key: "string",
                    prompt: "What to say:"
                }
            ]
        });
    }

    run(msg, cmd) {
        var text = cmd.string.split("").join("||||").substr(0, 1998);
        msg.channel.send("||" + text + "||");
    }
};
