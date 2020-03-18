const Discord = require('discord.js');
const newEmbed = require("../../embed");
const got = require("got");
const parse = require("node-html-parser").parse;

class Invite {
    getName() {
        return "xkcd";
    }
    getDesc() {
        return "Shows todays xkcd comic.";
    }
    async exec(cmd, client, msg) {
        cmd.shift();
        
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
}

module.exports = new Invite;