const user = require("../../managers/accountManager");
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
        var id = await user.fetchUser(msg.author.id);
        id = id.id;

        var embed = newEmbed();
        embed.setTitle("Achievements");
        /**
         * @todo user account link in user-centric commands
         * @body In setAuthor, add link to profile on web (once they're finished being implemented in website)
         */
        embed.setAuthor(msg.author.tag, msg.authoravatarURL());

        var achievmentsAwarded = await user.achievments(id);
        achievmentsAwarded.forEach(a => {
            embed.addField(`**${a.name}** [BBS: ${parseInt(a.value) / 1000}, XP: ${a.xp}]`, a.description);
        });

        if(achievmentsAwarded.length === 0) {
            msg.channel.send("You don't have any achievements... yet.");
        } else {
            msg.channel.send(embed);
        }
    }
};
