const Discord = require('discord.js');
const newEmbed = require("../../embed");
const tick = ":white_check_mark:";
const cross = ":x:";
const got = require('got');

class LogMe {
    getName() {
        return "npm";
    }
    getDesc() {
        return "Fetches info about NPM package";
    }
    exec(cmd, client, msg) {
        cmd.shift();
        if(!cmd[0]){
            msg.channel.send("You must specify a package to fetch");
            return;
        } 
        got("https://api.npms.io/v2/search?q=" + cmd[0]).then(body => {
            var json = body.body;
            var obj = JSON.parse(json);
            if(obj.total == 0){
                msg.channel.send("Package couldn't be found.");
                return;
            }
            var pkg = obj.results[0].package;
            var embed = newEmbed();
            embed.setTitle(pkg.name + "@" + pkg.version);
            embed.setURL(pkg.links.npm);
            embed.setDescription(pkg.description);
            embed.addField("» Author", pkg.author.name, true);
            embed.addField("» Publisher", pkg.publisher.username, true);
            embed.addField("» Maintainers", pkg.maintainers.map(e=>e.username).join(", "), true);
            msg.channel.send(embed);
        })

    }
}

module.exports = new LogMe;