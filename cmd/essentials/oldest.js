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
        var lang = await msg.guild.lang();
        var list = msg.guild.members.cache;

        list = list.sort((userA, userB) => {
            var res = userA.user.createdTimestamp - userB.user.createdTimestamp;
            if(res === 0) return 0;
            if(res < 0) return -1;
            if(res > 0) return 1;
        });
        list = list.array();

        var embed = newEmbed();

        embed.setTitle(lang.oldest.title);

        embed.addField(lang.oldest.users, list.size);

        var em = await msg.channel.send(embed);

        await pages(
            msg,
            embed,
            em,
            list,
            1,
            lang.oldest.pages,
            user => `${user.user.tag} (${user.displayName} @ ${user.user.createdAt.getUTCDate()}.${user.user.createdAt.getUTCMonth() + 1}. ${user.user.createdAt.getUTCFullYear()})`
        );
    }
};
