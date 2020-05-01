const commando = require("@iceprod/discord.js-commando");
const SE = require("stackexchange");

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

    async run(msg, cmd) {
        const filter = {
            order: "desc",
            sort: "activity",
            intitle: cmd.filter,
            site: "stackoverflow"
        };
        se.questions.questions(filter, function(err, results) {
            if(err)throw err;

            console.log(results.items);
            console.log(results.has_more);
        });
    }
};
