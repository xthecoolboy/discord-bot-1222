const { Command } = require("@iceprod/discord.js-commando");
const pool = require("../../managers/pool_mysql");

module.exports = class Guilds extends Command {
    constructor(client) {
        super(client, {
            name: "shorten",
            aliases: ["short"],
            group: "special",
            memberName: "shorten",
            ownerOnly: true,
            description: "Shorten URL",
            args: [
                {
                    key: "source",
                    type: "string",
                    prompt: "What's the source URL? Max 64 characters."
                },
                {
                    key: "target",
                    type: "url",
                    prompt: "What's the target URL?"
                }
            ],
            throttling: {
                usages: 2,
                duration: 10
            }
        });
    }

    async run(msg, { source, target }) {
        await pool.execute("INSERT INTO `shortener`.`url` (source, target, author) VALUES (?, ?, ?)", [source, target.toString(), msg.author.id]);
        msg.reply("shortened! Short URL: http://go-dan.tk/" + source);
    }
};
