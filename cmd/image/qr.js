const commando = require("@iceprod/discord.js-commando");
const newEmbed = require("../../embed");

module.exports = class QR extends commando.Command {
    constructor(client) {
        super(client, {
            name: "qr",
            aliases: ["qrcode"],
            memberName: "qr",
            usage: "qr <text>",
            group: "image",
            description: "Makes a QRCode from given text",
            args: [
                {
                    type: "string",
                    key: "text",
                    prompt: "Text to encode into QRCode"
                }
            ]
        });
    }

    urlEscape(str) {
        return encodeURI(str);
    }

    async run(msg, { text }) {
        text = this.urlEscape(text);

        var embed = newEmbed();
        var url = `http://qr.danbulant.eu/?code=${text}`;

        embed.setAuthor(msg.author.tag, msg.author.avatarURL());
        embed.setTitle("QR Code");
        embed.setImage(url);
        embed.setFooter(embed.footer.text + " | Using danbulant.eu API", embed.footer.iconURL);
        msg.channel.send(embed);
    }
};
