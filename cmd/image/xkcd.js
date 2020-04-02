const commando = require("discord.js-commando");
const newEmbed = require("../../embed");
const got = require("got");

module.exports = class Xkcd extends commando.Command {
    constructor(client) {
        super(client, {
            name: "xkcd",
            memberName: "xkcd",
            group: "image",
            aliases: ["comic"],
            description: "Shows todays xkcd comic."
        });
    }

    async run(msg) {
        got("https://xkcd.com/info.0.json").then(res => {
            var post = JSON.parse(res.body);
            var title = post.safe_title;
            var src = post.img;
            var embed = newEmbed();
            embed.setTitle(title);
            embed.setDescription("Today's comic");
            embed.setImage(src);
            msg.channel.send(embed);
        });
    }
};
