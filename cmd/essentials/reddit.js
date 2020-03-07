const Discord = require('discord.js');
const newEmbed = require("../../embed");

const got = require('got');

class Reddit {
    getName() {
        return "reddit";
    }
    getAliases() {
        return ["meme"];
    }
    getDesc() {
        return "Shows random image from given subreddit";
    }
    exec(cmd, client, msg) {
        if(cmd[0] == "meme"){
            var subreddit = "memes";
        } else {
            if (cmd[1].substr(0, 2) == "r/") cmd[1] = cmd[1].substr(2, cmd[1].length);
            console.log("Trying subreddit '" + cmd[1] + "'");
            var subreddit = cmd[1];
        }
        var embed = newEmbed();
        got(`https://imgur.com/r/${subreddit}/hot.json`, {json: true}).then(res => {
            var response = JSON.parse(res.body);
            var obj = response.data[Math.floor(Math.random() * response.data.length)];
            
            embed.setTitle(obj.title);
            embed.setImage("https://imgur.com/" + obj.hash + obj.ext.replace(/\?.*/, ''));
            var author = obj.author;
            var reddit = obj.reddit;
            got(`https://www.reddit.com/user/${obj.author}/about.json`, { json: true })
                .then(response => {
                    var res = JSON.parse(response.body);
                    
                    embed.setAuthor(author, res.data.icon_img, "https://reddit.com" + reddit);
                    embed.setURL("https://reddit.com" + reddit);
                    msg.channel.send(embed);
                }).catch(console.log)
        }).catch((e) => {
            console.log(e);
            msg.channel.send("An error occured. Is this subreddit public?")
        });
    }
}

module.exports = new Reddit;