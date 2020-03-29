const commando = require("discord.js-commando");
const newEmbed = require("../../embed");
const Discord = require("discord.js");

module.exports = class Meme extends commando.Command {
    constructor (client) {
        super(client, {
            name: "makeameme",
            memberName: "makeameme",
            aliases: ["meme"],
            group: "image",
            description: "Make a meme using imageurl/avatar toptext botomtext",
            args: [
                {
                    type: "user|string",
                    key: "url",
                    prompt: "Image URL to make meme of:"
                },
                {
                    type: "string",
                    key: "top",
                    prompt: "Top text of meme:"
                },
                {
                    type: "string",
                    key: "bottom",
                    prompt: "Bottom text of meme:"
                }
            ]
        });
    }

    urlEscape (str) {
        if (!str) return str;
        str = str
            .split("_").join("__")
            .split("-").join("--")
            .split(" ").join("_")
            .split("?").join("~q")
            .split("%").join("~p")
            .split("#").join("~h")
            .split("/").join("~s")
            .split("\"").join("''");
        return encodeURI(str);
    }

    async run (msg, cmd) {
        var image = cmd.url;
        if (image instanceof Discord.User) {
            image = image.avatarURL;/*
            try {
                var user = await this.client.fetchUser(image);
            } catch (e) {
                console.error(e);
                msg.channel.send("The user you referenced wasn't found. Did you ping properly?");
                return;
            }
            if (!user) {
                msg.channel.send("The user you referenced wasn't found. Did you ping properly?");
                return;
            }
            image = user.avatarURL; */
        }
        var top = this.urlEscape(cmd.top);
        var bottom = this.urlEscape(cmd.bottom);

        if (!bottom)bottom = "";

        var embed = newEmbed();
        var url = `https://memegen.link/custom/${top}/${bottom}.jpg?alt=${image}&watermark=none`;

        embed.setImage(url);
        msg.channel.send(embed);
    }
};
