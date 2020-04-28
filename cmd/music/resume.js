const commando = require("@iceprod/discord.js-commando");
const player = require("../../services/player/player");

module.exports = class Resume extends commando.Command {
    constructor(client) {
        super(client, {
            name: "resume",
            memberName: "resume",
            group: "music",
            description: "Resumes playback"
        });
    }

    async run(msg) {
        if(!msg.guild.voice) {
            return msg.channel.send("Bot is not connected to a voice channel. Join a music channel and invoke `join` command");
        }
        if(!player.isPaused(msg.guild)) {
            return msg.channel.send("Playback is already playing. Use `pause` to pause playback.");
        }
        try {
            await player.pause(msg.guild);
            msg.channel.send("Resumed");
        } catch(e) {
            console.log(e);

            msg.channel.send("Couldn't resume playback as nothing is playing");
        }
    }
};
