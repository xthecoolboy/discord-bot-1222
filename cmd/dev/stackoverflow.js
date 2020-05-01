const commando = require("@iceprod/discord.js-commando");
const SE = require("stackexchange");
const newEmbed = require("../../embed");

const opts = { version: 2.2 };
const se = new SE(opts);

module.exports = class StackOverflow extends commando.Command {
    constructor(client) {
        super(client, {
            name: "stackoverflow",
            aliases: ["stack", "so"],
            memberName: "stackoverflow",
            group: "dev",
            description: "Searches in StackOverflow.",
            hidden: true,
            args: [
                {
                    key: "filter",
                    prompt: "What to search for?",
                    type: "string"
                }
            ]
        });
    }

    parse(string) {
        string = string.replace(/&#([0-9])+;/gi, (sub, gr) => {
            return String.fromCharCode(gr);
        });

        if(~string.indexOf("TLDR")) {
            string = string.substr(string.indexOf("TLDR"), 1024);
        } else if(~string.indexOf("TL;DR")) {
            string = string.substr(string.indexOf("TL;DR"), 1024);
        } else {
            string = string.substr(0, 1024);
        }

        return string;
    }

    async run(msg, cmd) {
        const filter = {
            order: "desc",
            sort: "votes",
            intitle: cmd.filter.trim(),
            site: "stackoverflow",
            pagesize: 1,
            filter: "!b1MMEU*.-3EcYn"
        };
        se.search.search(filter, (err, results) => {
            if(err) {
                console.error(err);
                return;
            }

            console.log(results.items.length);
            var question = results.items[0];
            if(!question) {
                console.log(results, filter);
                return msg.channel.send("Couldn't find any question for that search");
            }

            var embed = newEmbed();
            embed.setTitle(question.title);
            embed.setURL("https://stackoverflow.com/a/" + question.answers[0].answer_id);
            embed.setAuthor(question.owner.display_name, question.owner.profile_image, question.owner.link);
            embed.setDescription(this.parse(question.body_markdown));
            embed.addField("Answer:", this.parse(question.answers[0].body_markdown));

            embed.setFooter(embed.footer.text + " | Content truncated", embed.footer.iconURL);

            msg.channel.send(embed);
        });
    }
};
