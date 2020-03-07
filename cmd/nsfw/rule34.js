const Discord = require('discord.js');
const newEmbed = require("../../embed");
const got = require("got");
const parse = require("node-html-parser").parse;
const user = require("../../accountManager");

class Invite {
    getName() {
        return "rule34";
    }
    getDesc() {
        return "Shows random lewd image from rule34. NSFW.";
    }
    async exec(cmd, client, msg) {
        cmd.shift();
        if (!msg.channel.nsfw && msg.channel.type != "dm") {
            msg.channel.send("This command is available only inside NSFW channels!");
            return;
        }
        user.sendAchievmentUnique(msg, "nsfw");
        got("https://r34-json-api.herokuapp.com/posts").then(res => {
            var html = JSON.parse(res.body);
            var post = html[Math.floor(Math.random() * html.length)];
            var title = post.tags[0];
            var src = post.file_url;
            var embed = newEmbed();
            embed.setTitle(title);
            embed.setImage(src);
            msg.channel.send(embed);
        });
    }
}

module.exports = new Invite;