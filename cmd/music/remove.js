const commando = require("@iceprod/discord.js-commando");

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
        var queue = await msg.guild.music.getQueue();

        queue = queue.splice(selected, length);

        await msg.guild.settings.set("music.queue", queue);
        await msg.guild.settings.set("music.playing", (await msg.guild.music.getPlayingId()) - length);

        msg.channel.send("Removed " + length + " song" + (length > 1 ? "s" : "") + " from queue.");
    }
};
