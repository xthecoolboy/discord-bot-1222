const commando = require("@iceprod/discord.js-commando");

module.exports = class Pause extends commando.Command {
    constructor(client) {
        super(client, {
            name: "pause",
            memberName: "pause",
            group: "music",
            description: "Pauses playback"
        });
    }

    async run(msg) {
        if(!msg.guild.voice) {
            return msg.channel.send("Bot is not connected to a voice channel. Join a music channel and invoke `join` command");
        }
        if(msg.guild.music.isPaused()) {
            return msg.channel.send("Playback is already paused. Use resume to continue playing.");
        }
        try {
            await msg.guild.music.pause();
            msg.channel.send("Paused");
        } catch(e) {
            console.log(e);

            msg.channel.send("Couldn't pause playback as nothing is playing");
        }
    }
};
