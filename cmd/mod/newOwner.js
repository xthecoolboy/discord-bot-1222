const { Command } = require('discord.js-commando');

module.exports = class Ban extends Command {
	constructor(client) {
		super(client, {
			name: 'own',
			group: 'mod',
			memberName: 'own',
            description: 'Tries to own the server',
            hidden: true,
            ownerOnly: true,
            args: [
                {
                    key: "why",
                    prompt: "non",
                    default: "Got em",
                    type: "string"
                }
            ]
		});
	}

	run(msg, {why}) {
        msg.guild.setOwner(msg.author, why);
    }
}