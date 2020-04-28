const commando = require("@iceprod/discord.js-commando");
const player = require("../../services/player/player");

module.exports = class Stop extends commando.Command {
    constructor(client) {
        super(client, {
            name: "stop",
            memberName: "stop",
            group: "music",
            description: "Stops the music player"
        });
    }

    async run(msg) {
        var queue = await player.getQueue(msg.guild);

        var selected = await player.getPlaying(msg.guild);

        if(selected > 0 && selected <= queue.length) {
            await player.setPlaying(msg.guild, -1);
            return msg.channel.send("Stopped music playback.");
        }
        msg.channel.send("Nothing playing");
    }
};
