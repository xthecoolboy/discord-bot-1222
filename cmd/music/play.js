const commando = require("@iceprod/discord.js-commando");
const account = require("../../managers/accountManager");

module.exports = class Play extends commando.Command {
    constructor(client) {
        super(client, {
            name: "play",
            memberName: "play",
            group: "music",
            description: "Add given music into queue",

            args: [
                {
                    key: "url",
                    type: "string",
                    prompt: "What music to add?"
                }
            ]
        });
    }

    async run(msg, { url }) {
        var dbuser = await account.fetchUser(msg.author.id);
        if(!dbuser.donor_tier) {
            return msg.channel.send("You can't use this command as you don't have premium");
        }
        if(!msg.guild.voice) {
            return msg.channel.send("Bot is not connected to a voice channel. Join a music channel and invoke `join` command");
        }
        try {
            await msg.guild.music.play(msg, url);
        } catch(e) {
            msg.channel.send("Bot is not connected to a voice channel. Join a music channel and invoke `join` command");
        }
    }
};
