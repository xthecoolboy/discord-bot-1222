const { Command } = require("@iceprod/discord.js-commando");
const Helper = require("../../managers/musicHelper");

module.exports = class ViewCommand extends Command {
    constructor(client) {
        super(client, {
            name: "view",
            aliases: ["view", "list", "queue"],
            group: "music",
            memberName: "view",
            description: "Views Music Queue tracks",
            examples: ["view", "list", "queue"],
            guildOnly: true,
            args: [{
                key: "page",
                prompt: "Enter page number",
                type: "integer",
                default: 1
            }]
        });
    }

    /**
     *
     * @param msg
     * @param args
     * @param fromPattern
     * @returns {Promise.<*>}
     */
    async run(msg, args, fromPattern) {
        try {
            const list = this.client.music.getMusicQueue(msg.guild);
            if(!list || list.length === 0) {
                await msg.say("Music queue is empty. Search for some songs first.");
                return;
            } else {
                await msg.say(`Guild - ${msg.guild.name} - Music Queue List\n` + Helper.getPaginatedList(list, args.page), { code: "python", split: true });
                return;
            }
        } catch(e) {
            console.warn("MUSIC VIEW ERROR:", e);
            return msg.say("Something went horribly wrong! Please try again later.");
        }
    }
};
