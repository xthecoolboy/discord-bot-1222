const commando = require("discord.js-commando");
const newEmbed = require("../../embed");
const httpCodeInfo = require("../../managers/httpCodeInfo");

module.exports = class HCode extends commando.Command {
    constructor (client) {
        super(client, {
            name: "code",
            memberName: "code",
            group: "dev",
            description: "Explanation for given http status code.",
            usage: "code <code>",
            args: [
                {
                    type: "integer",
                    key: "code",
                    prompt: "What code to get info about?"
                }
            ]
        });
    }

    run (msg, cmd) {
        this.msg = msg;
        this.cmd = cmd;
        try {
            var code = parseInt(cmd.code);
        } catch (e) {
            msg.channel.send("Expected format `ice code <code>`. <code> must be number.");
        }

        var buff = httpCodeInfo(code);

        if (!buff.length) {
            var embed = newEmbed();
            embed.setTitle("Not found");
            embed.setDescription("Code " + code + " wasn't found withing official or unnofficial HTTP status codes.");
            this.msg.channel.send(embed);
        } else {
            for (var info of buff) {
                if (info.official) {
                    this.output(info.name, info.content);
                } else {
                    this.outputUnnoficial(info.name, info.content);
                }
            }
        }
    }

    outputUnnoficial (text, desc) {
        var embed = newEmbed();
        embed.setTitle(this.cmd.code + " - (Non-standart) " + text);
        embed.setDescription(desc);
        embed.setFooter("© ICE Bot, TechmandanCZ#0135; Code from Wikipedia");
        this.msg.channel.send(embed);
    }

    output (text, desc) {
        this.found = true;
        var embed = newEmbed();
        embed.setTitle(this.cmd.code + " - " + text);
        embed.setDescription(desc);
        embed.setFooter("© ICE Bot, TechmandanCZ#0135; Code from Wikipedia");
        this.msg.channel.send(embed);
    }
};
