const commando = require("discord.js-commando");
const newEmbed = require("../../embed");

module.exports = class Say extends commando.Command {
    constructor(client){
        super(client, {
            name: "say",
            memberName: "say",
            group: "fun",
            description: "Make the bot say what you want",
            args: [
                {
                    type: "string",
                    key: "string",
                    prompt: "What do you want bot to say?"
                }
            ]
        })
    }
    run(msg, cmd) {
        var embed = newEmbed();

        embed.setAuthor(msg.author.name + msg.author.tag, msg.author.avatarURL);
        embed.setDescription(cmd.string);

        msg.channel.send("", {embed});
    }
}