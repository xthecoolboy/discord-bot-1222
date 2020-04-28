const commando = require("@iceprod/discord.js-commando");

module.exports = class Join extends commando.Command {
    constructor(client) {
        super(client, {
            name: "join",
            memberName: "join",
            group: "music",
            description: "Joins voice channel you're currently in."
        });
    }

    async run(msg) {
        if(msg.guild.voice) {
            msg.channel.send("The bot is already in a voice channel!");
            return;
        }
        if(!msg.member.voice) {
            msg.channel.send("You're not in a voice channel!");
            return;
        }
        try {
            await msg.member.voice.channel.join();
            msg.channel.send("Done!");
        } catch(e) {
            msg.channel.send("Couldn't join your voice channel. Make sure the bot has permission to join");
        }
    }
};
