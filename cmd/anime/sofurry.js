const commandParser = require("../../managers/commandParser");
const newEmbed = require("../../embed");
const got = require("got");
const Commando = require("@iceprod/discord.js-commando");

module.exports = class Invite extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "sofurry",
            group: "anime",
            memberName: "sofurry",
            description: "Random image from sofurry"
        });
    }

    async run(msg, cmd) {
        cmd = commandParser(cmd);

        got("https://api2.sofurry.com/browse/all/art?format=json").then(res => {
            var htmls = JSON.parse(res.body);
            var html = htmls.items;
            var post = html[Math.floor(Math.random() * html.length)];
            var title = post.author + " - " + post.title;
            var src = "https://www.sofurryfiles.com/std/content?page=" + post.id;
            var embed = newEmbed();
            embed.setTitle(title);
            embed.setImage(src);
            msg.channel.send(embed);
        });
    }
};
