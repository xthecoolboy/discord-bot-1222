const { Command } = require("discord.js-commando");
const newEmbed = require("../../embed");
const utils = require("../../utils");

module.exports = class warnCommand extends Command {
    constructor (client) {
        super(client, {
            name: "warn",
            group: "mod",
            memberName: "warn",
            description: "Warns a user",
            clientPermissions: ["KICK_MEMBERS"],
            userPermissions: ["KICK_MEMBERS"],
            args: [
                {
                    type: "user",
                    key: "user",
                    prompt: "which user do you want to warn?"
                },
                {
                    type: "string",
                    key: "reason",
                    prompt: "why do you want to warn this user?",
                    default: "No reason specified"
                }
            ]
        });
    }

    run (msg, cmd) {
        //if (this.client.isOwner(cmd.user.id)) return msg.say("You can't warn an owner of this bot!");

        if (cmd.user === this.client.user) return msg.say("You can't warn this bot!");

        // if (msg.member.guild.me.highestRole.comparePositionTo(msg.guild.member(cmd.user).highestRole) <= 0 || !msg.guild.member(cmd.user).warnable) return msg.say('You can\'t warn this user because the bot isn\'t high enough in the role hierachy!');

        if (msg.member.highestRole.comparePositionTo(msg.guild.member(cmd.user).highestRole) <= 0) return msg.say("You can't warn this user because you're not high enough in the role hierachy!");

        // Set number of total cases in the server
        let totalCaseCount = msg.guild.settings.get("totalcasecount", 0);
        totalCaseCount++;
        msg.guild.settings.set("totalcasecount", totalCaseCount);

        // Store details about this case
        const Case = {
            id: totalCaseCount,
            type: "warn",
            offender: cmd.user.tag,
            offenderID: cmd.user.id,
            moderator: msg.author.tag,
            moderatorID: msg.author.id,
            reason: cmd.reason,
            removed: false
        };

        msg.guild.settings.set(`case.${Case.id}`, Case);

        const warnCount = msg.guild.settings.get(`warns.${cmd.user.id}`, 1);
        msg.guild.settings.set(`warns.${cmd.user.id}`, warnCount + 1);

        const embed = newEmbed();
        embed.setColor("GOLD");
        embed.setAuthor(`${msg.author.username} | Case ${Case.id}`, msg.author.displayAvatarURL);
        embed.setDescription(`✅ Successfully warned user: <@${cmd.user.id}>! This is their ${utils.suffix(warnCount)} warning`);
        return msg.embed(embed);
    }
};
