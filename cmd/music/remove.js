const commando = require("@iceprod/discord.js-commando");
const player = require("../../services/player/player");

module.exports = class Remove extends commando.Command {
    constructor(client) {
        super(client, {
            name: "remove",
            memberName: "remove",
            group: "music",
            description: "Remove song from queue",

            args: [
                {
                    key: "selected",
                    type: "integer",
                    prompt: "Which song to remove from queue?"
                }, {
                    key: "length",
                    default: 1,
                    type: "integer",
                    prompt: "How many songs to delete?"
                }
            ]
        });
    }

    async run(msg, { selected, length }) {
        var queue = await player.getQueue(msg.guild);

        queue = queue.splice(selected, length);

        await msg.guild.settings.set("music.queue", queue);
        msg.channel.send("Removed " + length + " song" + (length > 1 ? "s" : "") + " from queue.");
    }
};
