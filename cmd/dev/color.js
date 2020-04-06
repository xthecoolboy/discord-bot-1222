const commando = require("discord.js-commando");

module.exports = class Color extends commando.Command {
    constructor(client) {
        super(client, {
            name: "color",
            memberName: "color",
            group: "dev",
            description: "Previews color",
            hidden: true,
            ownerOnly: true,
            args: [
                {
                    type: "string",
                    key: "color",
                    prompt: "What color you want to show?"
                }
            ]
        });
    }

    run(msg, cmd) {
    }
};
