const commando = require("@iceprod/discord.js-commando");
const player = require("../../services/player/player");

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
        if(volume) {
            await player.setVolume(msg.guild, volume);
            msg.channel.send("Done!");
        } else {
            msg.channel.send(`Current volume is ${await player.getVolume(msg.guild)}`);
        }
    }
};
