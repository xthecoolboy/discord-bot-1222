const { Command } = require("@iceprod/discord.js-commando");
const newEmbed = require("../../embed");

module.exports = class Ban extends Command {
    constructor(client) {
        super(client, {
            name: "ban",
            group: "mod",
            memberName: "ban",
            description: "Bans a user",
            usage: "ban <user> <daysToDeleteMessages> <reason>",
            clientPermissions: ["BAN_MEMBERS"],
            userPermissions: ["BAN_MEMBERS"],
            guildOnly: true,
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

    async run(msg, cmd) {
        var daysToDelete = 0;
        if(parseInt(cmd.reason.split(" ")[0])) daysToDelete = parseInt(cmd.reason.split(" ")[0]);
        // if (this.client.isOwner(cmd.user.id)) return msg.say("You can't ban an owner of this bot!");

        if(msg.guild.member(cmd.user)) {
            if(cmd.user === this.client.user) return msg.say("You can't ban this bot!");
            if(msg.author === cmd.user) return msg.say("You can't ban yourself!");
            if(msg.member.guild.me.highestRole.comparePositionTo(msg.guild.member(cmd.user).highestRole) <= 0 || !msg.guild.member(cmd.user).bannable) return msg.say("You can't ban this user because the bot isn't high enough in the role hierachy!");
            if(msg.member.highestRole.comparePositionTo(msg.guild.member(cmd.user).highestRole) <= 0) return msg.say("You can't ban this user because you're not high enough in the role hierachy!");
        }

        if(cmd.reason.length > 256) return msg.say("Reason must be under 256 characters!");

        await msg.guild.ban(cmd.user, {
            reason: cmd.reason,
            days: daysToDelete
        });
        // Set number of total cases in the server
        const totalCaseCount = await msg.guild.settings.get("totalcasecount", 0);

        // Store details about this case
        const Case = {
            id: totalCaseCount,
            type: "ban",
            offender: cmd.user.tag,
            offenderID: cmd.user.id,
            moderator: msg.author.tag,
            moderatorID: msg.author.id,
            reason: cmd.reason
        };

        let reason = cmd.reason;
        if(cmd.reason.length > 20) reason = cmd.reason.substr(0, 20) + "...";

        const embed = newEmbed();
        embed.setColor("RED");
        embed.setAuthor(`Ban ${Case.id} | Reason: "${reason}"`, msg.author.displayAvatarURL());
        embed.setDescription(`Responsible moderator: ${Case.moderator}\nUse \`${await msg.guild.settings.get("prefix", msg.client.commandPrefix)}case ${Case.id}\` for more information`);

        msg.embed(embed);
    }
};
