const commando = require("@iceprod/discord.js-commando");
const { compareArr } = require("../../utils");

module.exports = class channels extends commando.Command {
    constructor(client) {
        super(client, {
            name: "channels",
            memberName: "channels",
            group: "mod",
            description: "Lists allowed channels or sets/removes them",
            userPermissions: ["MANAGE_CHANNELS"],
            guildOnly: true,
            args: [
                {
                    prompt: "Please select an option: `<add | remove>`",
                    default: "",
                    key: "option",
                    type: "string",
                    oneOf: ["add", "remove", "clear"]

                },
                {
                    prompt: "Which channels to add/remove?",
                    default: "",
                    key: "channels",
                    infinite: true,
                    type: "channel"
                }
            ]
        });
    }

    run(msg, cmd) {
        var allowedChannels = msg.guild.settings.get("allowedChannels", []);
        const allChannels = msg.guild.channels.cache.array().filter(c => c.type === "text").map(c => c.id);
        const list = (c) => { return !c.length || compareArr(c.sort(), allChannels) ? "All channels are currently allowed! :smile:" : "**Allowed channels:**\n" + c.map(c => `<#${c}>`).join(", "); };

        switch(cmd.option) {
            case "clear":
                msg.guild.settings.set("allowedChannels", []);
                msg.say("Done!\n" + list([]));
                break;

            case "add":
                if(!cmd.channels) return msg.say("Please specify one or more channels!");
                for(const c of cmd.channels) { if(!allowedChannels.indexOf(c.id)) allowedChannels.push(c.id); }
                if(compareArr(allowedChannels.sort(), allChannels)) allowedChannels = [];
                msg.guild.settings.set("allowedChannels", allowedChannels);
                msg.say("Done!\n" + list(allowedChannels));
                break;

            case "remove":
                if(!cmd.channels) return msg.say("Please specify one or more channels!");
                if(!allowedChannels.length) allowedChannels = allChannels;
                allowedChannels = allowedChannels.filter(id => {
                    return !cmd.channels.map(c => c.id).includes(id);
                });
                if(!allowedChannels.length) return msg.say("You can't disallow all channels!");
                msg.guild.settings.set("allowedChannels", allowedChannels);
                msg.say("Done!\n" + list(allowedChannels));
                break;

            default:
                if(!allowedChannels.length || compareArr(allowedChannels.sort(), allChannels)) return msg.say("All channels are currently allowed! :smile:");
                return msg.say(list(allowedChannels));
        }
    }
};
