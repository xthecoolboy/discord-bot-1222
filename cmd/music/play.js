const commando = require("@iceprod/discord.js-commando");

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
        if(!msg.guild.voice) {
            return msg.channel.send("Bot is not connected to a voice channel. Join a music channel and invoke `join` command");
        }
        try {
            await msg.guild.music.play(msg, url);
        } catch(e) {
            msg.channel.send("Bot is not connected to a voice channel. Join a music channel and invoke `join` command");
        }
    }
};
