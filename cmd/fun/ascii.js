const commando = require("discord.js-commando");
const Font = require("ascii-art-font");

module.exports = class Ascii extends commando.Command {
    constructor(client) {
        super(client, {
            name: "ascii",
            memberName: "ascii",
            description: "Makes ascii text",
            usage: "ascii <text>",
            group: "fun",
            hidden: true,
            args: [
                {
                    type: "string",
                    key: "text",
                    prompt: "Text to use"
                }
            ]
        });
    }

    async run(msg, cmd) {
        Font.create(cmd.text, "Doom", function(rendered) {
            msg.channel.send("```\n" + rendered + "\n```");
        });
    }
};
