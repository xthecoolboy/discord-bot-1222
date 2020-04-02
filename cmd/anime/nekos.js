const newEmbed = require("../../embed");
const Nekos = require("nekos.life");
const neko = new Nekos().sfw;
const commando = require("discord.js-commando");

module.exports = class NekosCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: "nekos",
            group: "anime",
            memberName: "nekos",
            description: "Uses the nekos.life API. SFW only.",
            examples: ["nekos help"],
            args: [
                {
                    type: "string",
                    key: "command",
                    prompt: "What's the sub-command you want to run?"
                },
                {
                    type: "string",
                    key: "text",
                    default: "",
                    prompt: ""
                }
            ]
        });
    }

    async run(msg, cmd) {
        this.msg = msg;
        this.cmd = cmd;

        var text = [
            "why",
            "catText",
            "chat",
            "8ball",
            "fact",
            "OwOify"
        ];

        var c = cmd.command.toLowerCase();

        if(c === "help")this.help();
        else {
            if(typeof neko[c] === "function") {
                if(text.includes(c)) {
                    this.processText(c);
                } else {
                    this.nonText(c);
                }
            } else {
                msg.channel.send("Non-existent command or NSFW. See `nekos help`.");
            }
        }
    }

    async nonText(cmd) {
        var json = await neko[cmd]();
        this.send(json.url);
    }

    async processText(cmd) {
        var text = this.cmd.text;
        switch(cmd) {
            case"catText":
                this.sendText(await neko.catText({ text }).cat);
                break;
            case"OwOify":
                this.sendText(await neko.OwOify({ text }).owo);
                break;
            case"chat":
                this.sendText(await neko.chat({ text }).response);
                break;
            case"8ball":
                this.sendText(await neko["8ball"]({ text }));
                break;
        }
    }

    sendText(text) {
        var embed = newEmbed();
        embed.setTitle("Nekos!");
        embed.setDescription(text);
        this.msg.channel.send(embed);
    }

    help() {
        this.msg.channel.send("See https://github.com/Nekos-life/nekos-dot-life for available subcommands. Use them as `ice nekos <cmd>`. Only SFW.");
    }

    send(src) {
        var embed = newEmbed();
        embed.setTitle("Nekos!");
        embed.setImage(src);
        this.msg.channel.send(embed);
    }
};
