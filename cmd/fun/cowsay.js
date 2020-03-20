const commando = require('discord.js-commando');
const cowsay = require("cowsay");

module.exports = class Cowsay extends commando.Command{
    constructor(client){
        super(client, {
            name: "cow",
            memberName: "cow",
            group: "fun",
            description: "Ascii cow saying or thinking whatever you want",
            args: [
                {
                    type: "string",
                    key: "variant",
                    prompt: "Variant to use, think or say?"
                },{
                    type: "string",
                    key: "text",
                    prompt: "Text to make cow say/think:"
                }
            ]
        })
    }
    run(msg, cmd) {
        var saying = cmd.variant == "say";
        var { text } = cmd;

        text = text.replace("```", "``\\`");

        if(text.length > 1500){
            msg.channel.send("Too long message!");
        }
        
        if(saying){
            msg.channel.send("```\n" + cowsay.say({text}) + "\n```");
        } else {
            msg.channel.send("```\n" + cowsay.think({text}) + "\n```");
        }
    }
}