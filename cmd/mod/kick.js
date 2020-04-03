const { Command } = require("discord.js-commando");
const newEmbed = require("../../embed");

module.exports = class kickCommand extends Command {
    constructor(client) {
        super(client, {
            name: "kick",
            group: "mod",
            memberName: "kick",
            description: "Kicks a user",
            clientPermissions: ["KICK_MEMBERS"],
            userPermissions: ["KICK_MEMBERS"],
            args: [
                {
                    type: "user",
                    key: "user",
                    prompt: "which user do you want to kick?"
                },
                {
                    type: "string",
                    key: "reason",
                    prompt: "why do you want to kick this user?",
                    default: "No reason specified"
                }
            ]
        });
    }

    run(msg, cmd) {
        // if (this.client.isOwner(cmd.user.id)) return msg.say("You can't kick an owner of this bot!");

        if(cmd.user === this.client.user) return msg.say("You can't kick this bot!");

        if(msg.member.guild.me.highestRole.comparePositionTo(msg.guild.member(cmd.user).highestRole) <= 0 || !msg.guild.member(cmd.user).kickable) return msg.say("You can't kick this user because the bot isn't high enough in the role hierachy!");

        if(msg.member.highestRole.comparePositionTo(msg.guild.member(cmd.user).highestRole) <= 0) return msg.say("You can't kick this user because you're not high enough in the role hierachy!");

        if(msg.author === cmd.user) return msg.say("You can't kick yourself!");

        // Set number of total cases in the server
        let totalCaseCount = msg.guild.settings.get("totalcasecount", 0);
        totalCaseCount++;
        msg.guild.settings.set("totalcasecount", totalCaseCount);

        // Store details about this case
        const Case = {
            id: totalCaseCount,
            type: "kick",
            offender: cmd.user.tag,
            offenderID: cmd.user.id,
            moderator: msg.author.tag,
            moderatorID: msg.author.id,
            reason: cmd.reason
        };

        msg.guild.settings.set(`case.${Case.id}`, Case);

        let reason = cmd.reason;
        if(cmd.reason.length > 20) reason = cmd.reason.substr(0, 20) + "...";

        msg.guild.member(cmd.user).kick(cmd.reason);
        const embed = newEmbed();
        embed.setColor("GOLD");
        embed.setAuthor(`Kick ${Case.id} | Reason: "${reason}"`, msg.author.displayAvatarURL);
        embed.setDescription(`Responsible moderator: ${Case.moderator}\nUse \`${msg.client.commandPrefix}case ${Case.id}\` for more information`);
        return msg.embed(embed);
    }
};
