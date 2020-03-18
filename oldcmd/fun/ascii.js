const Discord = require('discord.js');
const newEmbed = require("../../embed");
const Font = require("ascii-art-font");

class Invite {
    disabled = true;
    getName() {
        return "ascii";
    }
    getDesc() {
        return "Ascii text";
    }
    exec(cmd, client, msg) {        
        cmd.shift();
        var text = cmd.join(" ");

        Font.create(text, 'Doom', function (rendered) {
            msg.channel.send("```\n" + rendered + "\n```");
        });
    }
}

module.exports = new Invite;