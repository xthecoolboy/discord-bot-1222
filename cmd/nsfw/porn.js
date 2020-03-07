const Discord = require('discord.js');
const newEmbed = require("../../embed");
const got = require("got");
const user = require("../../accountManager");

class Invite {
    getName() {
        return "porn";
    }
    getDesc() {
        return "Shows random image from json porn.";
    }
    async exec(cmd, client, msg) {
        cmd.shift();
        if (!msg.channel.nsfw && msg.channel.type != "dm") {
            msg.channel.send("This command is available only inside NSFW channels!");
            return;
        }
        user.sendAchievmentUnique(msg, "nsfw");
        got("https://steppschuh-json-porn-v1.p.mashape.com/porn/", {
            headers: {
                'X-Mashape-Authorization': 'yr5GZAQe5DmshVbMYpWvI2yXAk9Qp1fY3cAjsnbQumq1kB7jhL'
            }
        }).then(res => {
            var html = JSON.parse(res.body);
            var post = html.content[Math.floor(Math.random() * html.content.length)];
            var title = post.name;
            var src = "http://json-porn.com/image/"+post.imageKeyIds[0]+"/500.jpg";
            var embed = newEmbed();
            embed.setTitle(title);
            embed.setImage(src);
            msg.channel.send(embed);
        });
    }
}

module.exports = new Invite;