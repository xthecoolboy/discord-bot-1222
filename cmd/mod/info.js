const commando = require("discord.js-commando");
const newEmbed = require("../../embed");
const account = require("../../managers/accountManager");
const TimeAgo = require("javascript-time-ago");
const en = require("javascript-time-ago/locale/en");
TimeAgo.addLocale(en);

const timeAgo = new TimeAgo("en-US");

module.exports = class Info extends commando.Command {
    constructor (client) {
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
                    key: "command",
                    prompt: "Which resource you want to get info about?"
                },
                {
                    type: "user|string",
                    key: "pointer",
                    prompt: "Which member do you want to see info about? Leave blank for your info.",
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
    async run (msg, cmd) {
        this.msg = msg;
        this.cmd = cmd;
        // require("../../accountManager").sendAchievmentUnique(msg, "info");
        switch (cmd.command.toLowerCase()) {
            case "user":
                this.user();
                break;
            case "role":
                this.role();
                break;
            case "channel":
                this.channel();
                break;
            case "guild":
            case "server":
                this.guild();
                break;
            case "help":
                this.help();
                break;
            default:
                this.default();
        }
    }

    help () {
        var embed = newEmbed();
        embed.setTitle("Info");
        embed.setDescription("Gets information about specified object/user. In format `ice info <type> <arg>");
        embed.addField("`user`", "Gets info about user")
            .addField("`channel`", "Gets info about channel")
            .addField("`guild`", "Gets info about this guild. `server` possible too");
        this.msg.channel.send(embed);
    }

    default () {
        this.msg.channel.send("Unknown type, do `ice info help` for known types.");
    }

    async userUUID () {
        var embed = newEmbed();
        var dbuser = await account.fetchUserUUID(this.cmd.pointer);
        if (!dbuser) {
            this.msg.channel.send("Couldn't find anyone with that uuid");
            return;
        }
        var user = await this.client.fetchUser(dbuser.discord);
        var member = this.msg.guild.member(user);
        if (!member) {
            embed.setDescription("The user may not be member of this server");
        }

        embed.setTitle("User info");
        embed.setThumbnail(user.avatarURL);
        embed.addField("» Name", user.tag);
        embed.addField("» ID", user.id, true);
        embed.addField("» UUID", dbuser.uuid, true);
        embed.addField("» Donor", (dbuser.donor_tier > 0 ? ":white_check_mark: Tier " + dbuser.donor_tier : ":x: Not donor"), true);
        embed.addField("» Level", account.getLevel(dbuser), true);
        embed.addField("» BBS", account.getMoney(dbuser), true);
        embed.addField("» Bot", (user.bot ? ":white_check_mark: Beep boop!" : ":x: A human. Or not?"), true);
        embed.addField("» Registered", timeAgo.format(user.createdAt), true);
        if (member) embed.addField("» Roles", this.getRoles(member), true);
        embed.addField("» Online status:", this.getStatus(user.presence.status) + user.presence.status, true);

        this.msg.channel.send(embed);
    }

    async user () {
        var embed = newEmbed();
        var user = this.msg.author;
        if (this.msg.mentions.users.first() && this.msg.mentions.users.first() !== this.client.user) {
            user = this.msg.mentions.users.first();
        } else if (this.cmd.pointer) {
            if (this.cmd.pointer.toString().indexOf("-") !== -1) {
                this.userUUID();
                return;
            } else {
                return this.msg.channel.send("Fetch user info either by UUID or by ping");
                // console.log(this.msg.guild.members);
                // user = await this.msg.guild.members.fetch(this.cmd.pointer);
                // console.log(this.cmd.pointer, user);
                // if (!user) { return this.msg.channel.send("The user with given ID isn't in this server"); }
            }
        }
        var dbuser = await account.fetchUser(user.id);

        if (this.msg.guild) { var member = this.msg.guild.member(user); }

        embed.setTitle("User info");
        embed.setThumbnail(user.avatarURL);
        embed.addField("» Name", user.tag);
        embed.addField("» ID", user.id, true);
        embed.addField("» UUID", dbuser.uuid, true);
        embed.addField("» Donor", (dbuser.donor_tier > 0 ? ":white_check_mark: Tier " + dbuser.donor_tier : ":x: Not donor"), true);
        embed.addField("» Level", account.getLevel(dbuser), true);
        embed.addField("» XP", dbuser.xp + " / " + account.getNextLevel(dbuser.xp), true);
        embed.addField("» BBS", account.getMoney(dbuser), true);
        embed.addField("» Bot", (user.bot ? ":white_check_mark: Beep boop!" : ":x: A human. Or not?"), true);
        embed.addField("» Registered", timeAgo.format(user.createdAt), true);

        if (this.msg.guild) { embed.addField("» Roles", this.getRoles(member), true); }

        embed.addField("» Online status:", this.getStatus(user.presence.status) + user.presence.status, true);

        this.msg.channel.send(embed);
    }

    getStatus (status) {
        switch (status) {
            case "dnd":
                return ":no_entry:";
            case "online":
                return ":green_circle:";
            case "offline":
                return ":black_circle:";
        }
    }

    getRoles (member) {
        var output = "";
        var roles = member.roles.array();
        roles.shift();
        roles.forEach((role) => {
            output += "<@&" + role.id + "> - ";
        });
        if (output.length > 3) {
            output = output.substr(0, output.length - 3);
        }
        return output;
    }

    role () {
        var role = this.cmd[1];
        if (role.substr(0, 3) === "<@&")role = role.substr(3, role.length - 4);
        role = this.msg.guild.roles.get(role);
        if (!role) {
            return this.msg.channel.send("Couldn't find role.");
        }

        var embed = newEmbed();
        embed.setTitle("Info about role " + role.name);
        embed.setColor(role.hexColor);
        embed.addField("Color", role.hexColor);
        embed.addField("ID", role.id);
        embed.addField("Mentionable", role.mentionable);
        embed.addField("Since", timeAgo.format(role.createdAt));

        this.msg.channel.send(embed);
    }

    channel () {
        this.msg.channel.send("To do");
    }

    guild () {
        this.msg.channel.send("To do");
    }
};
