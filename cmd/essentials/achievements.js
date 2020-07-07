const commando = require("@iceprod/discord.js-commando");
const newEmbed = require("../../embed");

module.exports = class Achievements extends commando.Command {
    constructor(client) {
        super(client, {
            name: "achievements",
            memberName: "achievements",
            group: "essentials",
            description: "List all your achievements"
        });
    }

    async run(msg) {
        var lang = await msg.guild.lang();
        await msg.author.fetchUser();

        var embed = newEmbed();
        embed.setTitle(lang.achievements.title);
        /**
         * @todo user account link in user-centric commands
         * @body In setAuthor, add link to profile on web (once they're finished being implemented in website)
         */
        embed.setAuthor(msg.author.tag, msg.author.avatarURL());

        var achievmentsAwarded = await msg.author.achievments();
        achievmentsAwarded.forEach(a => {
            embed.addField(lang.achievements.format.replace("%s", a.name).replace("%f", parseInt(a.value) / 1000).replace("%n", a.xp), a.description);
        });

        if(achievmentsAwarded.length === 0) {
            msg.channel.send(lang.achievements.null);
        } else {
            msg.channel.send(embed);
        }
    }
};
