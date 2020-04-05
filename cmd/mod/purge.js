const {
    Command
} = require("discord.js-commando");
const newEmbed = require("../../embed");

module.exports = class Purge extends Command {
    constructor(client) {
        super(client, {
            name: "purge",
            group: "mod",
            memberName: "purge",
            description: "Deletes a certain amount of message in channel",
            clientPermissions: ["MANAGE_MESSAGES"],
            userPermissions: ["MANAGE_MESSAGES"],
            args: [{
                type: "integer",
                key: "amount",
                prompt: "How many messages do you want to delete?",
                default: ""
            }, {
                type: "string",
                key: "delete",
                prompt: "Delete the message as well?",
                onOf: ["true", "false"],
                default: "false"
            }]
        });
    }

    run(msg, cmd) {
        if(cmd.amount > 0 & cmd.amount < 500) {
            try {
                msg.channel.bulkDelete(cmd.amount + 1, true);

                var embed = newEmbed();
                embed.setDescription(`✅ Successfully purged ${cmd.amount} messages!`);
                embed.setAuthor(msg.author.username, msg.author.displayAvatarURL);

                return msg.channel.send(embed)
                    .then(msg => {
                        if(cmd.delete === "true") { msg.delete(3000); }
                    });
            } catch(e) {
                msg.channel.send("Something went wrong...");
                console.error(e);
            }
        } else {
            return msg.channel.send("Please select a valid amount between 1 and 99!");
        }
    }
};
