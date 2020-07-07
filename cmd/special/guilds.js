const { Command } = require("@iceprod/discord.js-commando");
const pages = require("../../managers/pages");
const newEmbed = require("../../embed");

module.exports = class Guilds extends Command {
    constructor(client) {
        super(client, {
            name: "guilds",
            aliases: ["guilds"],
            group: "special",
            memberName: "guilds",
            ownerOnly: true,
            description: "Lists guilds Aztec is in",
            throttling: {
                usages: 2,
                duration: 3
            }
        });
    }

    async run(msg) {
        var guilds = msg.client.guilds.cache;

        guilds = guilds.sort((a, b) => b.memberCount - a.memberCount);

        guilds = guilds.array();

        var embed = newEmbed();
        embed.setTitle("Top guilds");

        embed.addField("Guilds", "loading...");

        await pages(msg, embed, (await msg.channel.send(embed)), guilds, 1, "guilds",
            guild => {
                return `${guild.name} (${guild.memberCount}) [${guild.owner ? guild.owner.user.tag || guild.ownerID : guild.ownerID}]`;
            });
    }
};
