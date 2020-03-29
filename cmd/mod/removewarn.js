const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const newEmbed = require("../../embed");

module.exports = class removewarnCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'removewarn',
            group: 'mod',
            memberName: 'removewarn',
            description: 'Remove a warn from a user',
            userPermissions: ["KICK_MEMBERS"],
            args: [
                {
                type: 'integer',
                key: 'case',
                prompt: 'which warn case do you want to remove?',
                }
            ]
        })
    }

    run(msg, cmd) {

        let Case = msg.guild.settings.get(`case.${cmd.case}`);
        if (!Case) return msg.say(`Case '${cmd.case}' not found`);

        let warnCount = msg.guild.settings.get(`warns.${Case.offenderID}`, 1);
        msg.guild.settings.set(`warns.${Case.offenderID}`, warnCount - 1);

        msg.guild.settings.set(`case.${cmd.case}`, '');

        let embed = newEmbed();
            embed.setAuthor(`${msg.author.username} | Case ${Case.id}`, msg.author.displayAvatarURL)
            embed.setDescription(`✅ Successfully removed warning from user ${Case.offender}`);
        return msg.embed(embed);
    }

};
