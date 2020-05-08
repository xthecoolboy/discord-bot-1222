const commando = require("@iceprod/discord.js-commando");
const account = require("../../managers/accountManager");

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
        var dbuser = await account.fetchUser(msg.author.id);
        if(!dbuser.donor_tier) {
            return msg.channel.send("You can't use this command as you don't have premium");
        }
        var queue = await msg.guild.music.getQueue();
        var id = await msg.guild.music.getPlayingId();

        if(id > -1) {
            queue[id].current = id;
        }
        queue = msg.guild.music.shuffleArray(queue);

        if(id > -1) {
            // current one needs to be at same place
            var news = queue.findIndex(val => typeof val.current === "number");
            [queue[id], queue[news]] = [queue[news], queue[id]];
        }

        await msg.guild.settings.set("music.queue", queue);
        msg.channel.send("Shuffled  " + queue.length + " song" + (queue.length > 1 ? "s" : "") + " in queue.");
    }
};
