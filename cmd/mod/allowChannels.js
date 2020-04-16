const commando = require("@iceprod/discord.js-commando");

module.exports = class AllowChannels extends commando.Command {
    constructor(client) {
        super(client, {
            name: "allowchannels",
            aliases: ["allow-channels"],
            memberName: "allowchannels",
            group: "mod",
            description: "Lists allowed channels or sets them",
            userPermissions: ["MANAGE_CHANNELS"],
            args: [
                {
                    prompt: "Which channels to allow?",
                    default: "",
                    key: "channels",
                    infinite: true,
                    type: "channel"
                }
            ]
        });
    }

    run(msg, { channels }) {
        var allowedChannels = [];

        for(var channel of channels) {
            allowedChannels.push(channel.id);
        }

        msg.guild.settings.set("allowedChannels", allowedChannels);

        msg.channel.send("Done!");
    }
};
