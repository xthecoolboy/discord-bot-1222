const Discord = require('discord.js');
const newEmbed = require("../../embed");

const got = require('got');

class Reddit {
    getName() {
        return "skin";
    }
    getDesc() {
        return "Shows minecraft skin by given username/uuid";
    }
    exec(cmd, client, msg) {
        var embed = newEmbed();
        var username = cmd[1];
        got(`https://api.mojang.com/users/profiles/minecraft/${username}`, { json: true }).then(res => {
            var obj = JSON.parse(res.body);
            embed.setImage(`https://crafatar.com/renders/body/${obj.id}.png?overlay`);
            embed.setTitle(obj.name);
            msg.channel.send(embed);
        }).catch((e) => {
            console.log(e);
            msg.channel.send("An error occured. Does this minecraft account exist?")
        });
    }
}

module.exports = new Reddit;