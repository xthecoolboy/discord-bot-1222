const commando = require("discord.js-commando");

module.exports = class Google extends commando.Command {
    constructor(client) {
        super(client, {
            name: "google",
            memberName: "google",
            group: "dev",
            description: "Shows link to search given text on google",
            args: [
                {
                    type: "string",
                    key: "string",
                    prompt: "What to google?"
                }
            ]
        });
    }

    run(msg, cmd) {
        var query = cmd.string.split(" ").join("+");
        const search = "https://www.google.com/search?q=" + query;
        msg.channel.send(search);
        msg.delete();
    }
};
