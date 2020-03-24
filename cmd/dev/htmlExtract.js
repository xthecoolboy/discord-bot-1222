const commando = require("discord.js-commando");

module.exports = class HTMLExtractor extends commando.Command {
    constructor(client){
        super(client, {
            name: "extracthtml",
            memberName: "extracthtml",
            group: "dev",
            description: "Extracts some information from HTML page.",
            hidden: true,
            args: [{
                key: "page",
                prompt: "Which page to extract information?",
                type: "string"
            }]
        });
    }
}