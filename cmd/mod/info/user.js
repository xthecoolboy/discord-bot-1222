const newEmbed = require("../../../embed");
const account = require("../../../managers/accountManager");
const TimeAgo = require("javascript-time-ago");
const en = require("javascript-time-ago/locale/en");

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

async function userUUID() {
    var embed = newEmbed();
    var dbuser = await account.fetchUserUUID(this.cmd.pointer);
    if(!dbuser) {
        this.msg.channel.send("Couldn't find anyone with that uuid");
        return;
    }
    var user = await this.client.fetchUser(dbuser.discord);
    var member = this.msg.guild.member(user);
    if(!member) {
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

function getStatus(status) {
    switch(status) {
        case "dnd":
            return ":no_entry:";
        case "online":
            return ":green_circle:";
        case "offline":
            return ":black_circle:";
    }
}

function getRoles(member) {
    var output = "";
    var roles = member.roles.array();
    roles.shift();
    roles.forEach((role) => {
        output += "<@&" + role.id + "> - ";
    });
    if(output.length > 3) {
        output = output.substr(0, output.length - 3);
    }
    return output;
}

module.exports = async (msg, cmd) => {
    this.cmd = cmd;
    this.msg = msg;
    var embed = newEmbed();
    var user = this.msg.author;
    if(this.msg.mentions.users.first() && this.msg.mentions.users.first() !== this.client.user) {
        user = this.msg.mentions.users.first();
    } else if(this.cmd.pointer) {
        if(this.cmd.pointer.toString().indexOf("-") !== -1) {
            userUUID();
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

    if(this.msg.guild) { var member = this.msg.guild.member(user); }

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

    if(this.msg.guild) { embed.addField("» Roles", getRoles(member), true); }

    embed.addField("» Online status:", getStatus(user.presence.status) + user.presence.status, true);

    this.msg.channel.send(embed);
};
