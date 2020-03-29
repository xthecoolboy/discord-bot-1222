const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const newEmbed = require("../../embed");

module.exports = class caseCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'case',
            group: 'mod',
            memberName: 'case',
            description: 'Shows an offender case',
            args: [
                {
                type: 'integer',
                key: 'case',
                prompt: 'which case do you want to view?',
                }
            ]
        })
    }

    run(msg, cmd) {

        let Case = msg.guild.settings.get(`case.${cmd.case}`);
        if (!Case) return msg.say(`Case '${cmd.case}' not found`);

        let embed = newEmbed();
            embed.setTitle(`${Case.type} | case ${Case.id}`)
            embed.setDescription(`
                **Offender:** ${Case.offender} <@${Case.offenderID}>
                **Reason:** ${Case.reason}
                **Responsible moderator:** ${Case.moderator} <@${Case.moderatorID}>
            `)
        return msg.embed(embed);
    }

};
