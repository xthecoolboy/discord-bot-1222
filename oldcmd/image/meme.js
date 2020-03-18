const Discord = require('discord.js');
const newEmbed = require("../../embed");

class Invite {
    getName() {
        return "makeameme";
    }
    getDesc() {
        return "Make a meme using <image url/avatar> <top text>/<bottom text>";
    }
    urlEscape(str) {
        if(!str)return str;
        str = str
            .split("_").join("__")
            .split("-").join("--")
            .split(" ").join("_")
            .split("?").join("~q")
            .split("%").join("~p")
            .split("#").join("~h")
            .split("/").join("~s")
            .split("\"").join("''");
        return encodeURI(str);
    }
    async exec(cmd, client, msg) {
        cmd.shift();
        var image = cmd[0];
        if(image.substr(0,2) == "<@"){
            image = image.substr(2, image.length - 3);
            if(image.substr(0,1) == "!") image = image.substr(1);
            try {
                var user = await client.fetchUser(image);
            } catch (e) {
                console.error(e);
                msg.channel.send("The user you referenced wasn't found. Did you ping properly?");
                return;
            }
            if (!user) {
                msg.channel.send("The user you referenced wasn't found. Did you ping properly?");
                return;
            }
            image = user.avatarURL;
        }
        cmd.shift();
        var texts = cmd.join(" ");
        var top = this.urlEscape(texts.split("/")[0]);
        var bottom = this.urlEscape(texts.split("/")[1]);
        if(!bottom)bottom = "";
        var embed = newEmbed();
        var url = `https://memegen.link/custom/${top}/${bottom}.jpg?alt=${image}&watermark=none`;
        
        console.log(url);

        embed.setImage(url);
        msg.channel.send(embed);
    }
}

module.exports = new Invite;