const { Command } = require("@iceprod/discord.js-commando");

module.exports = class clearsettingsCommand extends Command {
    constructor(client) {
        super(client, {
            name: "clearsettings",
            group: "mod",
            memberName: "clearsettings",
            description: "Clears all the guilds settings",
            userPermissions: ["ADMINISTRATOR"],
            guildOnly: true,
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

    async run(msg) {
        try {
            await msg.guild.settings.clear();
            await msg.say("Success!");
        } catch(e) {
            console.error(e);
            await msg.say("Something went wrong...");
        }
    }
};
