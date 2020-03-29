const { Command } = require("discord.js-commando");
const newEmbed = require("../../embed");

module.exports = class caseCommand extends Command {
    constructor (client) {
        super(client, {
            name: "case",
            group: "mod",
            memberName: "case",
            description: "Shows an offender case",
            args: [
                {
                    type: "integer",
                    key: "case",
                    prompt: "which user do you want to warn?"
                }
            ]
        });
    }

    run (msg, cmd) {
        const Case = msg.guild.settings.get(`case.${cmd.case}`);
        if (!Case) return msg.say(`Case '${cmd.case}' not found`);

        let removedText = "";
        if (Case.removed) removedText = "**[REMOVED]**";

        const embed = newEmbed();
        embed.setTitle(`${Case.type} | case ${Case.id} ${removedText}`);
        embed.setDescription(`
                **Offender:** ${Case.offender} <@${Case.offenderID}>
                **Reason:** ${Case.reason}
                **Responsible moderator:** ${Case.moderator} <@${Case.moderatorID}>
            `);
        return msg.embed(embed);
    }
};
