const commando = require("@iceprod/discord.js-commando");
const client = require("../../managers/pool_mysql");
const newEmbed = require("../../embed");

module.exports = class Rich extends commando.Command {
    constructor(client) {
        super(client, {
            name: "rich",
            memberName: "rich",
            aliases: ["richest", "top"],
            group: "balance",
            description: "Shows rich people",
            args: [
                {
                    type: "integer",
                    key: "page",
                    prompt: "Page to look at",
                    default: 1
                }
            ]
        });
    }

    async run(msg, { page }) {
        page -= 1;
        var lang = await msg.guild.lang();
        var ids = msg.guild.members.cache.map(user => user.id);
        var questionMarks = "?,".repeat(ids.length);
        questionMarks = questionMarks.substr(0, questionMarks.length - 1);
        ids.push(page * 5, 5);

        var [count] = await client.query("SELECT COUNT(*) as total FROM users WHERE discord IN (" + questionMarks + ")", ids);

        var [users] = await client.query("SELECT bbs, donor_tier, discord FROM users WHERE discord IN (" + questionMarks + ") ORDER BY bbs DESC LIMIT ?, ?", ids);

        if(!users.length && page === 0) {
            return msg.channel.send(lang.rich.null);
        } else if(!users.length) {
            return msg.channel.send(lang.rich.page_not_found);
        }

        var embed = newEmbed();
        embed.setTitle(lang.rich.title.replace("%s", msg.guild.name));

        var description = "";

        for(var userPt in users) {
            if(userPt < 3 && page === 0) {
                switch(Number(userPt)) {
                    case 0:
                        description += ":first_place: ";
                        break;
                    case 1:
                        description += ":second_place: ";
                        break;
                    case 2:
                        description += ":third_place: ";
                        break;
                }
            } else {
                description += ":small_blue_diamond: ";
            }
            description += msg.guild.member(users[userPt].discord).displayName;
            description += " - ";
            description += users[userPt].bbs / 1000;
            description += " BBS\n";
        }

        embed.setDescription(description);
        embed.setFooter(lang.rich.page.replace("%n", page + 1).replace("%i", Math.ceil(count[0].total / 5)));
        msg.channel.send(embed);
    }
};
