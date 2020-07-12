const commando = require("@iceprod/discord.js-commando");
const { compareArr } = require("../../utils");
const newEmbed = require("../../embed");

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
                    prompt: "Please select an option: `<add | remove | clear>`",
                    default: "",
                    key: "option",
                    type: "string",
                    oneOf: ["add", "remove", "clear", "list"]

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

    async run(msg, cmd) {
        var allowedChannels = await msg.guild.settings.get("allowedChannels", []);
        const allChannels = msg.guild.channels.cache.array().filter(c => c.type === "text").map(c => c.id);
        const list = (c) => { return !c.length ? "All channels are currently allowed! :smile:" : c.map(c => `<#${c}>`).join(", "); };

        var embed = newEmbed();

        switch(cmd.option) {
            case "list":
                embed
                    .addField("Allowed Channels:", list(allowedChannels))
                    .setFooter("");
                msg.say(embed);
                break;

            case "clear":
                allowedChannels = [];
                await msg.guild.settings.set("allowedChannels", allowedChannels);
                embed
                    .setTitle("Done!")
                    .addField("Allowed Channels:", list(allowedChannels))
                    .setFooter("");
                msg.say(embed);
                break;

            case "add":
                if(!cmd.channels) return msg.say("Please specify one or more channels!");
                for(const c of cmd.channels) { if(!allowedChannels.includes(c.id)) allowedChannels.push(c.id); }
                if(compareArr(allowedChannels.sort(), allChannels)) allowedChannels = [];
                await msg.guild.settings.set("allowedChannels", allowedChannels);
                embed
                    .setTitle("Done!")
                    .addField("Allowed Channels:", list(allowedChannels))
                    .setFooter("");
                msg.say(embed);
                break;

            case "remove":
                if(!cmd.channels) return msg.say("Please specify one or more channels!");
                if(!allowedChannels.length) allowedChannels = allChannels;
                allowedChannels = allowedChannels.filter(id => !cmd.channels.map(c => c.id).includes(id));
                if(!allowedChannels.length) return msg.say("You can't disallow all channels!");
                await msg.guild.settings.set("allowedChannels", allowedChannels);
                embed
                    .setTitle("Done!")
                    .addField("Allowed Channels:", list(allowedChannels))
                    .setFooter("");
                msg.say(embed);
                break;

            default:
                embed
                    .addField("Allowed Channels:", list(allowedChannels))
                    .setFooter("");
                msg.say(embed);
        }
    }
};
