const Discord = require('discord.js');
const newEmbed = require("../../embed");
const Nekos = require('nekos.life');
const neko = new Nekos().nsfw;
const donors = require("../../donors");
const user = require("../../accountManager");

class Invite {
    getName() {
        return "lewd-nekos";
    }
    getDesc() {
        return "Shows random nekos image. See `lewd-nekos help`. 100% NSFW.";
    }
    async exec(cmd, client, msg) {
        cmd.shift();
        this.msg = msg;

        if (!msg.channel.nsfw && msg.channel.type != "dm") {
            msg.channel.send("This command is available only inside NSFW channels!");
            return;
        }
        if(!donors.includes(msg.author.id)){
            msg.channel.send("This is a premium command. More information at http://ice.danbulant.eu/premium");
            return;
        }
        if (!cmd[0]) {
            this.help();
            return;
        }
        user.sendAchievmentUnique(msg, "nsfw");

        var c = cmd[0];

        if (c == "help") this.help();
        else {
            if (typeof neko[c] == "function") {
                this.nonText(c);
            } else {
                msg.channel.send("Non-existent command or SFW. See `nekos help`.");
            }
        }
    }
    async nonText(cmd) {
        var json = await neko[cmd]();
        this.send(json.url);
    }
    help() {
        this.msg.channel.send("See https://github.com/Nekos-life/nekos-dot-life for available subcommands. Use them as `ice lewd-nekos <cmd>`. Only NSFW with this command.");
    }
    send(src) {
        var embed = newEmbed();
        embed.setTitle("Nekos!");
        embed.setImage(src);
        this.msg.channel.send(embed);
    }
}

module.exports = new Invite;