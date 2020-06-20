const commando = require("@iceprod/discord.js-commando");
const TimeAgo = require("javascript-time-ago");
const en = require("javascript-time-ago/locale/en");
TimeAgo.addLocale(en);

const helpInfo = require("./info/help");
const channelInfo = require("./info/channel");
const roleInfo = require("./info/role");
const guildInfo = require("./info/guild");

module.exports = class Info extends commando.Command {
    constructor(client) {
        super(client, {
            name: "info",
            memberName: "info",
            group: "mod",
            description: "Gets information",
            usage: "info help",
            guildOnly: true,
            args: [
                {
                    type: "string",
                    oneOf: ["user", "role", "channel", "server", "guild", "help"],
                    key: "command",
                    prompt: "Which resource you want to get info about?"
                },
                {
                    type: "user|string|role|channel",
                    key: "pointer",
                    prompt: "",
                    default: ""
                }
            ]
        });
    }

    /**
     *
     * @param {Array} cmd
     * @param {Discord.Client} client
     * @param {Discord.Message} msg
     */
    async run(msg, cmd) {
        this.msg = msg;
        this.cmd = cmd;
        // require("../../accountManager").sendAchievmentUnique(msg, "info");
        switch(cmd.command.toLowerCase()) {
            case "user":
                return msg.channel.send("Getting user info via `info` command was removed due to confusion about using it. Use new `profile` (alias `user`) command instead.");
            case "role":
                roleInfo(msg, cmd);
                break;
            case "channel":
                channelInfo(msg, cmd);
                break;
            case "guild":
            case "server":
                guildInfo(msg, cmd);
                break;
            case "help":
                helpInfo(msg);
                break;
        }
    }
};
