const commando = require("discord.js-commando");
const newEmbed = require("../../embed");

module.exports = class Logs extends commando.Command {
    constructor (client) {
        super(client, {
            name: "log",
            memberName: "log",
            group: "mod",
            description: "Log settings. When altering, use +option to add, -option to remove and !option to toggle log options",
            hidden: true,
            guildOnly: true,
            args: [
                {
                    type: "string",
                    oneOf: ["set", "remove", "alter", "view"],
                    key: "command",
                    prompt: "Which action to do?"
                }, {
                    type: "channel",
                    key: "channel",
                    prompt: "Which channel to add/remove?"
                }, {
                    type: "string",
                    key: "options",
                    prompt: "",
                    default: ""
                }
            ]
        });
    }

    async run (msg, { command, channel, options }) {
        const allowedOptions = [
            "*",
            "*.*",
            "user.*",
            "channel.*",
            "category.*",
            "guild.*",
            "roles.*",
            "config.*",

            "user.join",
            "user.leave",
            "user.avatar",
            "user.nickname",
            "user.name",
            "user.roles",

            "channel.create",
            "channel.delete",
            "channel.perms",
            "channel.name",

            "category.create",
            "category.delete",
            "category.perms",
            "category.name",

            "guild.perms",
            "guild.options",

            "roles.create",
            "roles.delete",
            "roles.color",
            "roles.rename",
            "roles.perms",

            "config.logs",
            "config.allowedChannels",
            "config.commands"
        ];
        /* eslint-disable no-redeclare */
        switch (command) {
            case "set":
                var channels = JSON.parse(msg.guild.settings.get("logs-channels", "[]"));
                channels.push({
                    options: ["*"],
                    channel: channel.id
                });
                console.log(channels);
                msg.guild.settings.set("logs-channel", JSON.stringify(channels));
                console.log(JSON.parse(msg.guild.settings.get("logs-channels", null)));
                msg.channel.send("New channel added with default settings");
                break;
            case "remove":
                var channels = JSON.parse(msg.guild.settings.get("logs-channels", "[]"));
                channels = channels.filter(ch => ch.channel !== channel.id);
                msg.guild.settings.set("logs-channel", channels);
                msg.channel.send("Removed the channel");
                break;
            case "alter":
                var channels = JSON.parse(msg.guild.settings.get("logs-channels", "[]"));
                var ch = channels.filter(ch => ch.channel === channel.id)[0];
                if (!ch) return msg.channel.send("This channel is not set as logging channel!");

                channels = channels.filter(ch => ch.channel !== channel.id);

                for (var option of options.split(" ")) {
                    switch (option[0]) {
                        case "+":
                            if (!ch.options.includes(option.substr(1))) {
                                ch.options.push(options.substr(1));
                            }
                            break;
                        case "-":
                            if (ch.options.includes(option.substr(1))) {
                                ch.options = ch.options.filter(c => c !== option.substr(1));
                            }
                            break;
                        case "!":
                            if (ch.options.includes(option.substr(1))) {
                                ch.options = ch.options.filter(c => c !== option.substr(1));
                            } else {
                                ch.options.push(option.substr(1));
                            }
                            break;
                        default:
                            msg.channel.send("Unknown operation with option " + option + ", ignoring");
                    }
                }

                ch.options = ch.options.filter(c => allowedOptions.includes(c));

                channels.push({
                    options: ch.options,
                    channel: channel.id
                });
                msg.channel.send("Altered the channel");
                break;
            case "view":
                var embed = newEmbed();
                embed.setTitle("Logging channel `#" + channel.name + "`");
                var ch = JSON.parse(msg.guild.settings.get("logs-channels", "[]"));
                ch = ch.filter(c => c.channel === channel.id)[0];
                if (!ch) {
                    embed.setDescription("The channel <#" + channel.id + "> is not setup as channel for logs!");
                } else {
                    embed.setDescription(ch.options.join());
                }
                msg.channel.send(embed);
                break;
        }
        /* eslint-enable no-redeclare */
    }
};
