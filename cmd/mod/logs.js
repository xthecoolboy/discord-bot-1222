const commando = require("@iceprod/discord.js-commando");
const newEmbed = require("../../embed");

module.exports = class Logs extends commando.Command {
    constructor(client) {
        super(client, {
            name: "log",
            memberName: "log",
            aliases: ["logs"],
            group: "mod",
            description: "Log settings. When altering, use +option to add, -option to remove and !option to toggle log options",
            hidden: true,
            guildOnly: true,
            args: [
                {
                    type: "string",
                    oneOf: ["set", "add", "remove", "alter", "view", "list"],
                    key: "command",
                    prompt: "Which action to do?"
                }, {
                    type: "channel",
                    key: "channel",
                    prompt: "Which channel to add/remove?",
                    isEmpty: (val, msg) => {
                        if(msg.content.indexOf("list") !== -1) return false;
                        if(!val) return true;
                        return val.length === 0;
                    },
                    validate: (val, msg) => {
                        if(msg.content.indexOf("list") !== -1) return true;
                        if(!val) return false;
                        return !!val.match(/<#[0-9]+>/);
                    },
                    parse: (val, msg) => {
                        if(msg.content.indexOf("list") !== -1) return "";
                        var id = val.match(/<#([0-9]+)>/);
                        return msg.guild.channels.resolve(id[1]);
                    }
                }, {
                    type: "string",
                    key: "settings",
                    prompt: "",
                    default: ""
                }
            ]
        });
    }

    async run(msg, { command, channel, settings }) {
        const allowedOptions = [
            "*",
            "*.*",
            "user.*",
            "channel.*",
            "category.*",
            "message.*",
            "guild.*",
            "roles.*",
            "config.*",
            "emoji.*",
            "invite.*",

            "user.join",
            "user.leave",
            "user.update",
            "user.presenceUpdate",

            "channel.create",
            "channel.delete",
            "channel.pins",
            "channel.update",
            "channel.name",

            "category.create",
            "category.delete",
            "category.perms",
            "category.name",

            "guild.update",
            // "guild.options",
            "guild.ban",
            "guild.removeBan",
            "guild.integration",
            "guild.kick",
            "guild.warn",
            "guild.webhook",

            "roles.create",
            "roles.update",

            "config.logs",
            "config.allowedChannels",
            "config.commands",

            "message.withLink",
            "message.withInvite",
            "message.edit",
            "message.delete",
            "message.purge",

            "emoji.create",
            "emoji.delete",
            "emoji.update",

            "invite.create",
            "invite.delete"
        ];
        /* eslint-disable no-redeclare */
        switch(command) {
            case "list":
                var channels = this.getLogs(msg);
                var embed = newEmbed();
                embed.setTitle("Logging channels:");
                embed.setDescription("Found " + channels.length + " channels to log into:");
                for(var channel of channels) {
                    var ch = msg.guild.channels.resolve(channel.id);
                    embed.addField("**#" + ch.name + "**", channel.settings.join());
                }
                msg.channel.send(embed);
                break;

            case "add":
            case "set":
                var channels = this.addLogsChannel(msg, {
                    settings: ["*"],
                    id: channel.id
                });
                msg.channel.send("New channel added with default settings");
                break;

            case "remove":
                if(this.removeLogsChannel(msg, channel.id)) {
                    msg.channel.send("Removed the channel");
                } else {
                    msg.channel.send("Channel doesn't exist");
                }
                break;

            case "alter":
                var ch = this.getLogsChannel(msg, channel.id);
                if(!ch) return msg.channel.send("The channel is not set as logging channel!");

                for(var option of settings.split(" ")) {
                    switch(option[0]) {
                        case "+":
                            if(!ch.settings.includes(option.substr(1))) {
                                ch.settings.push(settings.substr(1));
                            }
                            break;
                        case "-":
                            if(ch.settings.includes(option.substr(1))) {
                                ch.settings = ch.settings.filter(c => c !== option.substr(1));
                            }
                            break;
                        case "!":
                            if(ch.settings.includes(option.substr(1))) {
                                ch.settings = ch.settings.filter(c => c !== option.substr(1));
                            } else {
                                ch.settings.push(option.substr(1));
                            }
                            break;
                        default:
                            msg.channel.send("Unknown operation with option " + option + ", ignoring");
                    }
                }

                ch.settings = ch.settings.filter(c => allowedOptions.includes(c));

                var altered = this.alterLogsChannel(msg, channel.id, {
                    settings: ch.settings,
                    channel: channel.id
                });
                if(altered) {
                    msg.channel.send("Altered the channel");
                } else {
                    msg.channel.send("Couldn't alter the channel");
                }
                break;

            case "view":
                var embed = newEmbed();
                embed.setTitle("Logging channel `#" + channel.name + "`");
                var ch = this.getLogsChannel(msg, channel.id);
                if(!ch) {
                    embed.setDescription("The channel <#" + channel.id + "> is not setup as channel for logs!");
                } else {
                    embed.setDescription(ch.settings.join());
                }
                msg.channel.send(embed);
                break;
        }
        /* eslint-enable no-redeclare */
    }

    getLogs(msg, deleted = false) {
        var settings = msg.guild.settings;
        var sets = {
            * [Symbol.iterator]() {
                var i = 0;
                while(settings.get("logs.channels." + i, null)) {
                    if(settings.get("logs.channels." + i).deleted && !deleted) {
                        i++;
                        continue;
                    }
                    yield settings.get("logs.channels." + i);
                    i++;
                }
            }
        };
        var logs = [];
        for(var set of sets) {
            logs.push(set);
        }

        return logs;
    }

    getLogsChannel(msg, id) {
        var logs = this.getLogs(msg);
        return logs.filter(c => c.id === id)[0];
    }

    addLogsChannel(msg, data) {
        console.log("Adding channel to logs:", data);
        if(this.alterLogsChannel(msg, data.id, { ...data, deleted: false }, true)) {
            return true;
        }
        if(this.getLogsChannel(msg, data.id)) {
            return false;
        }
        var length = this.getLogs(msg).length;
        msg.guild.settings.set("logs.channels." + length, data);
    }

    removeLogsChannel(msg, id) {
        return this.alterLogsChannel(msg, id, { deleted: true });
    }

    alterLogsChannel(msg, id, data, deleted) {
        var logs = this.getLogs(msg);
        for(const logID in logs) {
            const log = logs[logID];
            if(log.id === id) {
                logs[logID] = {
                    ...log,
                    ...data
                };
                msg.guild.settings.set("logs.channels." + logID, logs[logID]);
                return true;
            }
        }
        return false;
    }
};
