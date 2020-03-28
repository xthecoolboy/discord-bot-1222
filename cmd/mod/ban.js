const { Command } = require('discord.js-commando');
const newEmbed = require("../../embed");

module.exports = class Ban extends Command {
	constructor(client) {
		super(client, {
			name: 'ban',
			group: 'mod',
			memberName: 'ban',
			description: 'Bans user from server',
			clientPermissions: ["BAN_MEMBERS"],
			userPermissions: ["BAN_MEMBERS"],
			args: [
				{
					key: 'user',
					prompt: 'Who do should be banned?\n',
					type: 'user'
				},{
                    key: "reason",
                    prompt: "Why do you want to ban the user?",
                    type: "string",
                    default: "No reason provided"
                }
			]
		});
	}

	run(msg, { user, reason }) {
	if (this.client.isOwner(user.id)) return msg.channel.send('the bot owner can not be blacklisted.');
		
	if (msg.member.highestRole.comparePositionTo(msg.guild.member(user).highestRole) <= 0) return msg.say("You can't ban this user because you're not high enough in the role hierachy!");

        if(this.client.user == user)return msg.channel.send("You can't ban me!");

        if(!msg.guild.member(user).bannable)return msg.channel.send("You can't ban this user");

        msg.guild.ban(user, { reason });

		var embed = newEmbed();

		embed.setTitle(user.tag + " banned");
		embed.setAuthor(msg.author.tag, msg.author.avatarURL);

        msg.channel.send(embed);
    }
}
