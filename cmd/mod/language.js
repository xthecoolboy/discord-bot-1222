const { Command } = require("@iceprod/discord.js-commando");

module.exports = class Language extends Command {
    constructor(client) {
        super(client, {
            name: "lang",
            group: "mod",
            aliases: ["language"],
            memberName: "lang",
            description: "Sets server language",
            userPermissions: ["ADMINISTRATOR"],
            args: [
                {
                    type: "string",
                    key: "lang",
                    oneOf: ["en", "cz"],
                    prompt: "What language do you want to use?",
                    default: ""
                }
            ]
        });
    }

    async run(msg, cmd) {
        var lang = await msg.guild.lang();
        if(!cmd.lang) {
            return msg.channel.send(lang.lang.current.replace("%s", await msg.guild.settings.get("lang", "en")));
        }
        await msg.guild.settings.set("lang", cmd.lang);
        msg.channel.send((await msg.guild.lang()).general.done);
    }
};
