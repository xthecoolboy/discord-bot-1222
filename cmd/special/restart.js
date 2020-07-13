const commando = require("@iceprod/discord.js-commando");

module.exports = class restart extends commando.Command {
    constructor(client) {
        super(client, {
            name: "restart",
            memberName: "restart",
            group: "special",
            description: "Restarts the bot",
            ownerOnly: true,
            args: []
        });
    }

    run(msg, { args }) {
        console.log("Restarting bot...");
        msg.reply("restarting...");
        process.exit(0);
    }
};
