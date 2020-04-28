const commando = require("@iceprod/discord.js-commando");
const player = require("../../services/player/player");

module.exports = class Pause extends commando.Command {
    constructor(client) {
        super(client, {
            name: "skip",
            memberName: "skip",
            group: "music",
            description: "Skips currently playing song(s)",

            args: [
                {
                    type: "integer",
                    key: "number",
                    prompt: "How many songs to skip?",
                    default: 1
                }
            ]
        });
    }

    async run(msg, { number }) {
        if(!msg.guild.voice) {
            return msg.channel.send("Bot is not connected to a voice channel. Join a music channel and invoke `join` command");
        }
        try {
            await player.skip(msg.guild, number);
            msg.channel.send("Skipped " + number + " songs.");
        } catch(e) {
            console.log(e);

            msg.channel.send("The number of songs selected is too large or less than 1.");
        }
    }
};
