const { Command } = require("discord.js-commando");
const newEmbed = require("../../embed");

module.exports = class Ban extends Command {
    constructor (client) {
        super(client, {
            name: "ban",
            group: "mod",
            memberName: "ban",
            description: "Bans a user",
            clientPermissions: ["BAN_MEMBERS"],
            userPermissions: ["BAN_MEMBERS"],
            args: [
                {
                    type: "user",
                    key: "user",
                    prompt: "which user do you want to ban?"
                },
                {
                    type: "string",
                    key: "reason",
                    prompt: "why do you want to ban this user?",
                    default: "No reason specified"
                }
            ]
        });
    }

    run (msg, cmd) {
        //if (this.client.isOwner(cmd.user.id)) return msg.say("You can't ban an owner of this bot!");

        if (cmd.user === this.client.user) return msg.say("You can't ban this bot!");

        if (msg.member.guild.me.highestRole.comparePositionTo(msg.guild.member(cmd.user).highestRole) <= 0 || !msg.guild.member(cmd.user).bannable) return msg.say("You can't ban this user because the bot isn't high enough in the role hierachy!");

        if (msg.member.highestRole.comparePositionTo(msg.guild.member(cmd.user).highestRole) <= 0) return msg.say("You can't ban this user because you're not high enough in the role hierachy!");

        if (msg.author === cmd.user) return msg.say("You can't ban yourself!");

        // Set number of total cases in the server
        let totalCaseCount = msg.guild.settings.get("totalcasecount", 0);
        totalCaseCount++;
        msg.guild.settings.set("totalcasecount", totalCaseCount);

        // Store details about this case
        const Case = {
            id: totalCaseCount,
            type: "kick",
            offender: cmd.user,
            moderator: msg.author,
            reason: cmd.reason
        };

        msg.guild.settings.set(`case.${Case.id}`, Case);

        msg.guild.member(cmd.user).ban(cmd.reason);
        const embed = newEmbed();
        embed.setColor("RED");
        embed.setAuthor(`${msg.author.username} | Case ${Case.id}`, msg.author.displayAvatarURL);
        embed.setDescription(`✅ Successfully banned user: <@${cmd.user.id}>! Reason: ${cmd.reason}`);
        return msg.embed(embed);
    }
};
