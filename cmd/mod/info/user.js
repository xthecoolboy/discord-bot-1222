const newEmbed = require("../../../embed");
const account = require("../../../managers/accountManager");
const TimeAgo = require("javascript-time-ago");
const en = require("javascript-time-ago/locale/en");

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

function getRoles(msg, user) {
    const roles = msg.guild.member(user).roles.cache.array();
    const result = roles.sort((a, b) => (a.position > b.position) ? -1 : ((b.position > a.position) ? 1 : 0));
    roles.pop();
    return result.join(" - ");
}

function getStatus(status) {
    switch(status) {
        case "idle":
            return ":yellow_circle:";
        case "dnd":
            return ":no_entry:";
        case "online":
            return ":green_circle:";
        case "offline":
            return ":black_circle:";
    }
}

module.exports = async (msg, cmd) => {
    var user = cmd.pointer ? cmd.pointer : msg.author;

    if(RegExp("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}", "i").test(cmd.pointer)) {
        var dbuser = await account.fetchUserUUID(user);
        if(dbuser) {
            var member = await msg.client.fetchUser(dbuser.discord);
            user = member;
        } else return msg.say("Hmmm.. I couldn't find that user :smile:");
    } /* else if(RegExp("<((@!?\d+)|(:.+?:\d+))>", "i").test(cmd.pointer)) dbuser = await account.fetchUser(user.id);
    else return msg.say("User not found"); */

    try {
        dbuser = await account.fetchUser(user.id);
    } catch(e) {
        return msg.say("Hmmm.. I couldn't find that user :smile:");
    }

    var offenseNum = 0;
    const iterable = {
        [Symbol.iterator]: () => {
            var current = 0;
            return {
                next() {
                    current++;
                    var data = msg.guild.settings.get("case." + current, null);
                    if(!data) {
                        return { value: null, done: true };
                    }
                    return { value: data, done: false };
                }
            };
        }
    };

    for(var Case of iterable) {
        if(Case.offenderID === cmd.user.id && !Case.removed) {
            offenseNum++;
        }
    }

    var embed = newEmbed();
    embed.setTitle("User info");
    embed.setThumbnail(user.avatarURL);
    embed.addField("» Name", user.tag);
    embed.addField("» ID", user.id, true);
    embed.addField("» UUID", dbuser.uuid, true);
    embed.addField("» Donor", (dbuser.donor_tier > 0 ? ":white_check_mark: Tier " + dbuser.donor_tier : ":x: Not donor"), true);
    embed.addField("» Level", account.getLevel(dbuser), true);
    embed.addField("» XP", dbuser.xp + " / " + account.getNextLevel(dbuser.xp), true);
    embed.addField("» BBS", account.getMoney(dbuser), true);
    embed.addField("» Offenses", `**${offenseNum}**`, true);
    embed.addField("» Bot", (user.bot ? ":white_check_mark: Beep boop!" : ":x: A human. Or not?"), true);
    embed.addField("» Registered", timeAgo.format(user.createdAt), true);
    if(msg.guild) embed.addField("» Roles", getRoles(msg, user), true);
    embed.addField("» Online status:", getStatus(user.presence.status), true);

    msg.say(embed);
};
