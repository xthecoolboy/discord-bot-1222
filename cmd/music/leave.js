const commando = require("@iceprod/discord.js-commando");

module.exports = class Leave extends commando.Command {
    constructor(client) {
        super(client, {
            name: "leave",
            memberName: "leave",
            group: "music",
            description: "Leaves the voice channel."
        });
    }

    async run(msg) {
        if(!msg.guild.voice) {
            msg.channel.send("The bot isn't in a voice channel!");
            return;
        }
        try {
            await msg.member.voice.channel.leave();
            msg.channel.send("Done!");
        } catch(e) {
            msg.channel.send("Something went wrong");
        }
    }
};
