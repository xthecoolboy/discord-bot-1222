const commando = require("@iceprod/discord.js-commando");
const pages = require("../../managers/pages");
const newEmbed = require("../../embed");

module.exports = class Oldest extends commando.Command {
    constructor(client) {
        super(client, {
            name: "oldest",
            aliases: ["old"],
            memberName: "oldest",
            group: "essentials",
            description: "Shows oldest users on discord"
        });
    }

    async run(msg) {
        var list = msg.guild.members.cache;
        list = list.sort((userA, userB) => userA.createdTimestamp - userB.createdTimestamp);
        list = list.array();

        var embed = newEmbed();

        embed.setTitle("Oldest users of this server");

        embed.addField("Users", list.size);

        var em = await msg.channel.send(embed);

        await pages(msg, embed, em, list, 1, "oldest users", user => `${user.user.tag} (${user.displayName} @ ${user.user.createdAt.getUTCDate()}.${user.user.createdAt.getUTCMonth() + 1}. ${user.user.createdAt.getUTCFullYear()})`);
    }
};
