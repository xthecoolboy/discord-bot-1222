const { Command } = require("@iceprod/discord.js-commando");
const newEmbed = require("../../embed");

module.exports = class warnCommand extends Command {
    constructor(client) {
        super(client, {
            name: "warn",
            group: "mod",
            memberName: "warn",
            description: "Warns a user",
            userPermissions: ["KICK_MEMBERS"],
            guildOnly: true,
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

    async run(msg, cmd) {
        // if (this.client.isOwner(cmd.user.id)) return msg.say("You can't warn an owner of this bot!");
        var member = msg.guild.member(cmd.user);

        if(!member) return msg.say("Hmmm.. I couldn't find that user o.o");

        if(cmd.user === this.client.user) return msg.say("You can't warn this bot!");
        if(msg.member.roles.highest.comparePositionTo(msg.guild.member(cmd.user).roles.highest) <= 0) return msg.say("You can't warn this user because you're not high enough in the role hierachy!");
        if(cmd.reason.length > 256) return msg.say("Reason must be under 256 characters!");

        let reason = cmd.reason;
        await member.warn(reason, msg.author);

        var caseCount = await msg.guild.settings.get("totalcasecount", 0);

        if(cmd.reason.length > 20) reason = cmd.reason.substr(0, 20) + "...";
        const embed = newEmbed();
        embed.setColor("GOLD");
        embed.setAuthor(`Warn ${caseCount} | Reason: "${reason}"`, msg.author.displayAvatarURL());
        embed.setDescription(`Responsible moderator: ${msg.author.tag}\nUse \`${await msg.guild.settings.get("prefix", msg.client.commandPrefix)}case ${caseCount}\` for more information`);
        return msg.embed(embed);
    }
};
