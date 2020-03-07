const newEmbed = require("../../embed");
const account = require("../../accountManager");
const TimeAgo = require('javascript-time-ago');
const en = require('javascript-time-ago/locale/en');
TimeAgo.addLocale(en)

const timeAgo = new TimeAgo('en-US')

class Info {
    getName() {
        return "info";
    }
    getDesc() {
        return "Gets information. See `ice info help`";
    }
    /**
     * 
     * @param {Array} cmd 
     * @param {Discord.Client} client 
     * @param {Discord.Message} msg 
     */
    exec(cmd, client, msg) {
        cmd.shift();
        this.cmd = cmd;
        this.client = client;
        this.msg = msg;
        require("../../accountManager").sendAchievmentUnique(msg, "info");
        switch(cmd[0].toLowerCase()){
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
    help() {
        var embed = newEmbed();
        embed.setTitle("Info");
        embed.setDescription("Gets information about specified object/user. In format `ice info <type> <arg>");
        embed.addField("`user`", "Gets info about user")
            .addField("`channel`", "Gets info about channel")
            .addField("`guild`", "Gets info about this guild. `server` possible too");
        this.msg.channel.send(embed);
    }
    default() {
        this.msg.channel.send("Unknown type, do `ice info help` for known types.");
    }
    async userUUID() {
        var embed = newEmbed();
        var dbuser = await account.fetchUserUUID(this.cmd[1]);
        if(!dbuser){
            this.msg.channel.send("Couldn't find anyone with that uuid");
            return;
        }
        var user = await this.client.fetchUser(dbuser.discord);
        var member = this.msg.guild.member(user);
        if(!member){
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
        if(member) embed.addField("» Roles", this.getRoles(member), true);
        embed.addField("» Online status:", this.getStatus(user.presence.status) + user.presence.status, true);

        this.msg.channel.send(embed);
    }
    async user() {
        var embed = newEmbed();
        if(this.msg.mentions.users.first()){
            var user = this.msg.mentions.users.first();
        } else if(this.cmd[1]){
            this.userUUID();
            return;
        } else {
            var user = this.msg.author;
        }
        var dbuser = await account.fetchUser(user.id);
        var member = this.msg.guild.member(user);
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
        embed.addField("» Roles", this.getRoles(member), true);
        embed.addField("» Online status:", this.getStatus(user.presence.status) + user.presence.status, true);

        this.msg.channel.send(embed);
    }
    getStatus(status) {
        switch(status) {
            case "dnd":
                return ":no_entry:";
            case "online":
                return ":green_circle:";
            case "offline":
                return ":black_circle:";
        }
    }
    getRoles(member) {
        var output = "";
        var roles = member.roles.array();
        roles.shift();
        roles.forEach((role)=>{
            output += "<@&" + role.id + "> - ";
        });
        if(output.length > 3){
            output = output.substr(0, output.length - 3);
        }
        return output;
    }
    role() {
        var role = this.cmd[1];
        if(role.substr(0, 3) == "<@&")role = role.substr(3, role.length - 4);
        role = this.msg.guild.roles.get(role);
        if(!role){
            return this.msg.channel.send("Couldn't find role.");
        }

        var embed = newEmbed();
        embed.setTitle("Info about role " + role.name);
        embed.setColor(role.hexColor);
        embed.addField("Color", role.hexColor);
        embed.addField("ID", role.id);
        embed.addField("Mentionable", role.mentionable);
        embed.addField("Since", timeAgo.format(role.createdAt) );

        this.msg.channel.send(embed);
    }
    channel() {
        this.msg.channel.send("To do");
    }
    guild() {
        this.msg.channel.send("To do");
    }
}

module.exports = new Info;