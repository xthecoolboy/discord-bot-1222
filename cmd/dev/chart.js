const commando = require("@iceprod/discord.js-commando");
const discord = require("discord.js");

module.exports = class Chart extends commando.Command {
    constructor(client) {
        super(client, {
            name: "chart",
            memberName: "chart",
            group: "dev",
            description: "Generates a simple chart. Uses quickchart.io",
            args: [
                {
                    type: "string",
                    key: "args",
                    prompt: "what data to visualize?"
                }
            ]
        });
    }

    async run(msg, { args }) {
        msg.channel.send("", new discord.MessageAttachment(
            "https://quickchart.io/chart?width=512&height=512&c=" + encodeURI(args),
            "chart.png", {
                height: 512,
                width: 512
            }));
    }
};
