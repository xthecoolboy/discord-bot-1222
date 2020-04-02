const{ Command } = require("discord.js-commando");

module.exports = class clearsettingsCommand extends Command {
    constructor(client) {
        super(client, {
            name: "clearsettings",
            group: "mod",
            memberName: "clearsettings",
            description: "Clears all the guilds settings",
            userPermissions: ["ADMINISTRATOR"],
            args: [
                {
                    key: "confirmation",
                    type: "string",
                    oneOf: ["confirm"],
                    prompt: "WARNING - this will delete all the guilds cases and other settings! Are you sure? Type `confirm` to confirm."
                }
            ]
        });
    }

    run(msg) {
        try {
            msg.guild.settings.clear();
            msg.say("Success!");
        } catch(e) {
            console.error(e);
            msg.say("Something went wrong...");
        }
    }
};
