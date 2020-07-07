const commando = require("@iceprod/discord.js-commando");

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
        var dbuser = await msg.author.fetchUser();
        if(!dbuser.donor_tier) {
            return msg.channel.send("You can't use this command as you don't have premium");
        }
        var queue = await msg.guild.music.getQueue(msg.guild);

        var selected = await msg.guild.music.getPlaying(msg.guild);

        if(selected > -1 && selected < queue.length) {
            await msg.guild.music.setPlaying(msg.guild, -1);
            return msg.channel.send("Stopped music playback.");
        }
        msg.channel.send("Nothing playing");
    }
};
