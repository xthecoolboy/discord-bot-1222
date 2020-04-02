const commando = require("discord.js-commando");

module.exports = class Clap extends commando.Command {
    constructor(client) {
        super(client, {
            name: "clap",
            memberName: "clap",
            aliases: ["clapify"],
            description: "Clapify given text",
            group: "fun",
            args: [
                {
                    type: "string",
                    key: "string",
                    prompt: "Text to clapify"
                }
            ]
        });
    }

    run(msg, cmd) {
        msg.channel.send(cmd.string.split(" ").join("👏"));
    }
};
