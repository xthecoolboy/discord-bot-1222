const commando = require("@iceprod/discord.js-commando");
const SE = require("stackexchange");

const opts = { version: 2.2 };
const se = new SE(opts);

module.exports = class StackExchange extends commando.Command {
    constructor(client) {
        super(client, {
            name: "stackexchange",
            aliases: ["stack", "se", "so"],
            memberName: "stackexchange",
            group: "dev",
            description: "Searches in stack exchange forums.",
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

        };
        se.questions.questions(filter, function(err, results) {
            if(err)throw err;

            console.log(results.items);
            console.log(results.has_more);
        });
    }
};
