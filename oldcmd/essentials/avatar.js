const Discord = require('discord.js');
const newEmbed = require("../../embed");

class Invite {
    getName() {
        return "avatar";
    }
    getAliases() {
        return ["av"];
    }
    getDesc() {
        return "Shows yours (or someone else's) avatar";
    }
    async exec(cmd, client, msg) {
        var user = null;
        if(!cmd[1]){
            user = msg.author;
        } else {
            var id = cmd[1].substr(2, cmd[1].length - 3);
            if(id.substr(0,1) == "!")id = id.substr(1);
            try {
                user = await client.fetchUser(id);
            } catch(e){
                msg.channel.send("The user you referenced wasn't found. Did you ping properly?");
                return;
            }
            if(!user){
                msg.channel.send("The user you referenced wasn't found. Did you ping properly?");
                return;
            }
        }
        var embed = newEmbed();
        embed.setTitle(user.username);
        embed.setImage(user.avatarURL);
        msg.channel.send(embed);
    }
}

module.exports = new Invite;