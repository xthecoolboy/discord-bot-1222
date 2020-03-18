//https://api2.sofurry.com/browse/all/art?format=json
//https://www.sofurryfiles.com/std/content?page=1529445
const Discord = require('discord.js');
const newEmbed = require("../../embed");
const got = require("got");

class Invite {
    getName() {
        return "sofurry";
    }
    getDesc() {
        return "Shows random image from sofurry.";
    }
    async exec(cmd, client, msg) {
        cmd.shift();
        
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
}

module.exports = Invite;