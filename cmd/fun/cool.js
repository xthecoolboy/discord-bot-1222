const commando = require("@iceprod/discord.js-commando");

module.exports = class Cool extends commando.Command {
    constructor(client) {
        super(client, {
            name: "cool",
            memberName: "cool",
            group: "fun",
            description: "Cool up something",
            args: [
                {
                    key: "cool",
                    type: "string",
                    prompt: "What do you want to cool?"
                }
            ]
        });
    }

    async run(msg, cmd) {
        var lang = await msg.guild.lang();
        msg.channel.send(lang.cool.cooling.replace("%s", cmd.cool));
    }
};
