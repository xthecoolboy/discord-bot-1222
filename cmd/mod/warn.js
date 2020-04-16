const { Command } = require("@iceprod/discord.js-commando");
const newEmbed = require("../../embed");

module.exports = class warnCommand extends Command {
    constructor(client) {
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

    run(msg, cmd) {
        // if (this.client.isOwner(cmd.user.id)) return msg.say("You can't warn an owner of this bot!");

        if(!msg.guild.member(cmd.user)) return msg.say("Hmmm.. I couldn't find that user o.o");

        if(cmd.user === this.client.user) return msg.say("You can't warn this bot!");
        if(msg.member.highestRole.comparePositionTo(msg.guild.member(cmd.user).highestRole) <= 0) return msg.say("You can't warn this user because you're not high enough in the role hierachy!");
        if(cmd.reason.length > 256) return msg.say("Reason must be under 256 characters!");

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

        let reason = cmd.reason;
        if(cmd.reason.length > 20) reason = cmd.reason.substr(0, 20) + "...";
        const embed = newEmbed();
        embed.setColor("GOLD");
        embed.setAuthor(`Warn ${Case.id} | Reason: "${reason}"`, msg.author.displayAvatarURL);
        embed.setDescription(`Responsible moderator: ${Case.moderator}\nUse \`${msg.client.commandPrefix}case ${Case.id}\` for more information`);
        return msg.embed(embed);
    }
};
