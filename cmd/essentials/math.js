const commando = require("@iceprod/discord.js-commando");
const math = require("mathjs");
const sl = require("singleline");

module.exports = class Math extends commando.Command {
    constructor(client) {
        super(client, {
            name: "math",
            aliases: ["calc", "calculator"],
            memberName: "math",
            group: "essentials",
            description: "Calculates given math expression",
            args: [
                {
                    type: "string",
                    key: "expression",
                    prompt: "What expression to calculate?"
                }
            ]
        });
    }

    async run(msg, { expression }) {
        var lang = await msg.guild.lang();
        try {
            msg.channel.send(sl(`
            \`\`\`
            ${math.evaluate(expression)}
            \`\`\`
            `, true));
        } catch(e) {
            msg.channel.send(lang.math.error);
        }
    }
};
