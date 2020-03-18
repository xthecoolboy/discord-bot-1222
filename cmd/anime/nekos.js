const newEmbed = require("../../embed");
const Nekos = require('nekos.life');
const neko = new Nekos().sfw;
const commando = require("discord.js-commando");

console.log("Required nekos");

module.exports = class NekosCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: "nekos",
            group: "anime",
            memberName: "nekos",
            description: "Uses the nekos.life API. SFW only.",
            examples: ["nekos help"]
        });
    }

    text = [
        "why",
        "catText",
        "chat",
        "8ball",
        "fact",
        "OwOify"
    ];

    async run(msg, cmd) {
        this.msg = msg;

        if(!cmd[0]){
            this.help();
            return;
        }
        
        var c = cmd[0].toLowerCase();
        
        if(c=="help") this.help();
        else {
            if(typeof neko[c] == "function"){
                if(this.text.includes(c)){
                    this.processText(c);
                } else {
                    this.nonText(c);
                }
            } else {
                msg.channel.send("Non-existent command or NSFW. See `nekos help`.");
            }
        }
    }
    async nonText(cmd){
        var json = await neko[cmd]();
        this.send(json.url);
    }
    async processText(cmd){
        switch (cmd) {
            case "catText":
                var text = this.msg.substr("ice nekos catText".length);
                this.sendText(await nekos.catText({ text }).cat);
                break;
            case "OwOify":
                var text = this.msg.substr("ice nekos OwOify".length);
                this.sendText(await nekos.OwOify({ text }).owo);
                break;
            case "chat":
                var text = this.msg.substr("ice nekos chat".length);
                this.sendText(await nekos.chat({ text }).response);
                break;
            case "8ball":
                var text = this.msg.substr("ice nekos 8ball".length);
                this.sendText(await nekos["8ball"]({ text }));
                break;
        }
    }
    sendText(text) {
        var embed = newEmbed();
        embed.setTitle("Nekos!");
        embed.setDescription(text);
        this.msg.channel.send(embed);
    }
    help(){
        this.msg.channel.send("See https://github.com/Nekos-life/nekos-dot-life for available subcommands. Use them as `ice nekos <cmd>`. Only SFW.");
    }
    send(src){
        var embed = newEmbed();
        embed.setTitle("Nekos!");
        embed.setImage(src);
        this.msg.channel.send(embed);
    }
}