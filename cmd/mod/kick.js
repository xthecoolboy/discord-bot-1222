const { Command } = require('discord.js-commando');
const newEmbed = require("../../embed");

module.exports = class Ban extends Command {
	constructor(client) {
		super(client, {
			name: 'kick',
			group: 'mod',
			memberName: 'kick',
			description: 'Kicks user from server',
			clientPermissions: ["KICK_MEMBERS"],
			userPermissions: ["KICK_MEMBERS"],
			args: [
				{
					key: 'user',
					prompt: 'Who should be kicked?',
					type: 'user'
				},{
                    key: "reason",
                    prompt: "Why do you want to kick the user?",
                    type: "string",
                    default: "No reason provided"
                }
			]
		});
	}

	run(msg, { user, reason }) {
		if (this.client.isOwner(user.id)) return msg.channel.send('the bot owner can not be kicked.');

        if(this.client.user == user)return msg.channel.send("You can't kick me!");

        if(!msg.guild.member(user).kickable)return msg.channel.send("You can't ban this user");

        msg.guild.member(user).kick(reason);

		var embed = newEmbed();

		embed.setTitle(user.tag + " kicked");
		embed.setAuthor(msg.author.tag, msg.author.avatarURL);

        msg.channel.send(embed);
    }
}