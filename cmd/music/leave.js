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

    /**
     * @param {Commando.Message} msg
     */
    async run(msg) {
        var dbuser = await msg.author.fetchUser();
        if(!dbuser.donor_tier) {
            return msg.channel.send("You can't use this command as you don't have premium");
        }
        if(!msg.guild.voice) {
            msg.channel.send("The bot isn't in a voice channel!");
            return;
        }
        try {
            await msg.guild.voice.channel.leave();
            if(msg.guild.voice.connection) {
                msg.guild.voice.connection.disconnect();
            }
            msg.channel.send("Done!");
        } catch(e) {
            msg.channel.send("Something went wrong");
        }
    }
};
