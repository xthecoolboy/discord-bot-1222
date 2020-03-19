const commando = require('discord.js-commando');

module.exports = class Vaporwave extends commando.Command {
    constructor(client){
        super(client, {
            name: "vaporwave",
            memberName: "vaporwave",
            aliases: ["vaporify"],
            description: "Vaporify given text",
            args: [
                {
                    type: "string",
                    key: "string",
                    prompt: "What to vaporify?"
                }
            ]
        });
    }
    vaporify(text) {
        const charToFullWidth = char => {
            const c = char.charCodeAt(0)
            return c >= 33 && c <= 126
                ? String.fromCharCode((c - 33) + 65281)
                : char
        }

        text = text.split('').map(charToFullWidth).join('');
        return text;
    }
    exec(msg, cmd) {
        var text = cmd.string;
        text = this.vaporify(text);
        msg.channel.send(text.split("").join(" "));
    }
}