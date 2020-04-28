const commando = require("@iceprod/discord.js-commando");
const player = require("../../services/player/player");

module.exports = class Now extends commando.Command {
    constructor(client) {
        super(client, {
            name: "now",
            aliases: ["np", "now-playing"],
            memberName: "now",
            group: "music",
            description: "Show current playing song"
        });
    }

    async run(msg) {
        var queue = await player.getQueue(msg.guild);

        var selected = await player.getPlaying(msg.guild);

        if(selected > 0 && selected <= queue.length) {
            return await msg.channel.send(player.getEmbed(queue[selected - 1]));
        }
        msg.channel.send("Nothing playing");
    }
};
