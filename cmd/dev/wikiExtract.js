const commando = require("@iceprod/discord.js-commando");

module.exports = class WikiExtractor extends commando.Command {
    constructor(client) {
        super(client, {
            name: "extractwiki",
            memberName: "extractwiki",
            group: "dev",
            description: "Extracts some information from Wikipedia page.",
            hidden: true,
            args: [{
                key: "page",
                prompt: "Which page to extract information?",
                type: "string"
            }, {
                key: "lang",
                prompt: "Which language to fetch from?",
                type: "string",
                default: "en"
            }]
        });
    }
};
