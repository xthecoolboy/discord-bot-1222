const commando = require("@iceprod/discord.js-commando");
const player = require("../../services/player/player");

module.exports = class Play extends commando.Command {
    constructor(client) {
        super(client, {
            name: "play",
            memberName: "play",
            group: "music",
            description: "Add given music into queue",

            args: [
                {
                    key: "url",
                    type: "string",
                    prompt: "What music to add?"
                }
            ]
        });
    }

    async run(msg, { url }) {
        try {
            await player.play(msg, url);
        } catch(e) {
            console.warn(e);
            msg.channel.send("Bot is not connected to a voice channel. Join a music channel and invoke `join` command");
        }
    }
};
