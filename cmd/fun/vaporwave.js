const Discord = require('discord.js');
const newEmbed = require("../../embed");

class Invite {
    getName() {
        return "vaporwave";
    }
    getDesc() {
        return "Vaporify";
    }
    vaporify(text) {
        const charToFullWidth = char => {
            const c = char.charCodeAt(0)
            return c >= 33 && c <= 126
                ? String.fromCharCode((c - 33) + 65281)
                : char
        }

        text = text.split('').map(charToFullWidth).join('');
        return text;
    }
    exec(cmd, client, msg) {
        cmd.shift();
        if(!cmd[0]){
            msg.channel.send("What do you want me to vapor-ify?");
            return;
        }
        var text = cmd.join("");
        text = this.vaporify(text);
        msg.channel.send(text.split("").join(" "));
    }
}

module.exports = new Invite;