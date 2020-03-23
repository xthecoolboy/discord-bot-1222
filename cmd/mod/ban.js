const { Command } = require('discord.js-commando');

module.exports = class Ban extends Command {
	constructor(client) {
		super(client, {
			name: 'ban',
			group: 'mod',
			memberName: 'ban',
			description: 'Bans user from server',
			args: [
				{
					key: 'user',
					prompt: 'whom do you want to blacklist?\n',
					type: 'user'
				}
			]
		});
	}

	run(msg, { user }) {
		if (this.client.isOwner(user.id)) return msg.channel.send('the bot owner can not be blacklisted.');

        if(this.client.user == user)return msg.channel.send("You can't ban me!");

        if(!msg.guild.member(user).bannable)return msg.channel.send("You can't ban this user");

        msg.guild.ban(user);

        msg.channel.send("Got 'em");
    }
}