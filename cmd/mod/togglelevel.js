const commando = require("@iceprod/discord.js-commando");

module.exports = class ToggleLevel extends commando.Command {
    constructor(client) {
        super(client, {
            name: "togglelevel",
            aliases: ["toggle-level"],
            memberName: "togglelevel",
            group: "mod",
            userPermissions: ["ADMINISTRATOR"],
            description: "Toggles level up messages"
        });
    }

    async run(msg) {
        await msg.guild.settings.set("levelup", !(await msg.guild.settings.get("levelup")));
        msg.channel.send("Toggled! Current state " + (await msg.guild.settings.get("levelup") ? "on" : "off"));
    }
};
