const commando = require("@iceprod/discord.js-commando");

module.exports = class Leet extends commando.Command {
    constructor(client) {
        super(client, {
            name: "leetify",
            memberName: "leetify",
            aliases: ["leet"],
            description: "Leetify your text",
            group: "fun",
            args: [
                {
                    type: "string",
                    key: "string",
                    prompt: "Text to leetify:"
                }
            ]
        });
    }

    leet(str) {
        str = str
            .replace(/e/gi, 3)
            .replace(/t/gi, 7)
            .replace(/o/gi, 0)
            .replace(/i/gi, 1)
            .replace(/a/gi, 4)
            .replace(/h/g, "H")
            .replace(/u/g, "U")
            .replace(/k/g, "K")
            .replace(/m/g, "M");
        return str;
    }

    run(msg, cmd) {
        msg.channel.send(this.leet(cmd.string));
    }
};
