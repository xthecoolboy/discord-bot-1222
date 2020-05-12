
const { Command } = require("@iceprod/discord.js-commando");

module.exports = class Reason extends Command {
    constructor(client) {
        super(client, {
            name: "reason",
            aliases: ["editreason"],
            group: "mod",
            memberName: "reason",
            description: "Warns a user",
            userPermissions: ["KICK_MEMBERS"],
            guildOnly: true,
            args: [
                {
                    type: "integer",
                    key: "case",
                    prompt: "which case do you want to edit?"
                },
                {
                    type: "string",
                    key: "reason",
                    prompt: "what should the new reason be?"
                }
            ]
        });
    }

    run(msg, cmd) {
        const Case = msg.guild.settings.get(`case.${cmd.case}`);
        if(!Case) return msg.say(`Case '${cmd.case}' not found`);

        Case.reason = cmd.reason;

        msg.guild.settings.set(`case.${cmd.case}`, Case);

        msg.say(`✅ Successfully updated reason for case ${Case.id}`);
    }
};
