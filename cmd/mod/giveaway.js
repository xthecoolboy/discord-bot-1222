const commando = require("@iceprod/discord.js-commando");
const newEmbed = require("../../embed");

module.exports = class Giveaway extends commando.Command {
    constructor(client) {
        super(client, {
            name: "giveaway",
            memberName: "giveaway",
            group: "mod",
            description: "Makes a giveaway in current channel",
            permissions: ["ADMINISTRATOR"],
            guildOnly: true,
            args: [
                {
                    type: "channel",
                    prompt: "Which channel to send to?",
                    key: "channel"
                }, {
                    type: "integer",
                    prompt: "How many minutes to wait?",
                    key: "time"
                }, {
                    type: "string",
                    prompt: "Which item for winning?",
                    key: "item"
                }
            ]
        });
    }

    async run(msg, cmd) {
        if(!msg.member.hasPermission("ADMINISTRATOR")) { return msg.channel.send("You don't have permissions!"); }
        const embed = newEmbed()
            .setTitle("Giveaway! :tada:")
            .setDescription(cmd.item)
            .setColor("#7cfc00")
            .setFooter(`React 🎉 to join - ${cmd.time}`)
            .setTimestamp();
        cmd.channel.send(embed).then(msg => {
            msg.react("🎉");
            setTimeout(() => {
                const peopleReacted = msg.reactions.get("🎉").users;
                var winners = peopleReacted.random(5);

                var winner;
                for(var win of winners) {
                    if(win !== this.client.user) {
                        winner = win;
                        break;
                    }
                }

                cmd.channel.send(`${winner.tag} has won ${cmd.item}! :tada:`);
                const finalE = newEmbed()
                    .setTitle("Giveaway Over")
                    .setColor("#ff8c00")
                    .setDescription(`Winner: <@${winner.id}>`);
                msg.edit(finalE);
            }, cmd.time * 60000);
        });
    }
};
