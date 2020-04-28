const commando = require("@iceprod/discord.js-commando");
const player = require("../../services/player/player");

module.exports = class Shuffle extends commando.Command {
    constructor(client) {
        super(client, {
            name: "shuffle",
            memberName: "shuffle",
            group: "music",
            description: "Shuffles the queue"
        });
    }

    async run(msg) {
        var queue = await player.getQueue(msg.guild);
        var id = await player.getPlayingId(msg.guild);

        if(id > -1) {
            queue[id].current = id;
        }
        queue = player.shuffle(queue);

        if(id > -1) {
            // current one needs to be at same place
            var news = queue.findIndex(val => typeof val.current === "number");
            [queue[id], queue[news]] = [queue[news], queue[id]];
        }

        await msg.guild.settings.set("music.queue", queue);
        msg.channel.send("Shuffled  " + queue.length + " song" + (queue.length > 1 ? "s" : "") + " in queue.");
    }
};
