const commando = require("@iceprod/discord.js-commando");

module.exports = class Volume extends commando.Command {
    constructor(client) {
        super(client, {
            name: "volume",
            aliases: ["vol"],
            memberName: "volume",
            group: "music",
            description: "Sets music volume",

            args: [
                {
                    type: "integer",
                    default: -1,
                    key: "volume",
                    prompt: "What to set the new volume to?"
                }
            ]
        });
    }

    async run(msg, { volume }) {
        if(volume > 0) {
            if(volume > 150) {
                return msg.channel.send("You can't set volume more than 150%");
            }
            await msg.guild.music.setVolume(volume / 100);
            msg.channel.send("Done!");
        } else {
            msg.channel.send(`Current volume is ${await msg.guild.music.getVolume()}`);
        }
    }
};
