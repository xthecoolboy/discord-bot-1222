const Discord = require('discord.js');
const newEmbed = require("../../embed");
const got = require("got");
const parse = require("node-html-parser").parse;
const user = require("../../accountManager");

class Invite {
    getName() {
        return "e621";
    }
    getDesc() {
        return "Shows random lewd image from e621. Possible NSFW.";
    }
    async exec(cmd, client, msg) {
        cmd.shift();
        if (!msg.channel.nsfw && msg.channel.type != "dm") {
            msg.channel.send("This command is available only inside NSFW channels!");
            return;
        }
        user.sendAchievmentUnique(msg, "nsfw");
        got("https://e621.net/post/index.json").then(res => {
            var html = JSON.parse(res.body);
            var post = html[Math.floor(Math.random() * html.length)];
            var title = post.author;
            var src = post.file_url;
            var embed = newEmbed();
            embed.setTitle(title);
            embed.setImage(src);
            msg.channel.send(embed);
        });
    }
}

module.exports = new Invite;