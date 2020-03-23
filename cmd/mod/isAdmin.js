const { Command } = require('discord.js-commando');

module.exports = class Ban extends Command {
	constructor(client) {
		super(client, {
			name: 'isadmin',
			group: 'mod',
			memberName: 'isadmin',
            description: 'Check for ADMIN permission',
            hidden: true,
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
    }
}