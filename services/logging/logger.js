const newEmbed = require("../../embed");
const { Permissions } = require("discord.js");

function getLogs(guild, deleted = false) {
    var settings = guild.settings;
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

function match(event, types) {
    var eventGroups = event.split(".");

    /* eslint-disable no-labels */
    typeLoop:
    for(const type of types) {
        var groups = type.split(".");
        for(const groupID in groups) {
            if(groups[groupID] === "*") {
                return true;
            }
            if(groups[groupID] !== eventGroups[groupID]) {
                continue typeLoop;
            }
        }
        return true;
    }
    /* eslint-enable no-labels */
    return false;
}

async function format(args, event) {
    /* eslint-disable no-redeclare */
    const embed = newEmbed();
    embed.setTimestamp(new Date());

    console.log("Got event", event);

    switch(event) {
        case "channelCreate":
            var channel = args[0];
            embed.setTitle("Channel created - #" + channel.name);
            embed.setDescription("New channel: <#" + channel.id + ">");
            return embed;
        case "channelDelete":
            var channel = args[0];
            embed.setTitle("Channel deleted - #" + channel.name);
            embed.setDescription("Deleted: <#" + channel.id + ">");
            return embed;
        case "channelUpdate": // TODO: Fix channel update for permissions
            embed.setTitle("Channel updated - #" + args[1].name);
            embed.setDescription("Updated: <#" + args[0].id + ">");
            const newChannel = new Map();
            for(var prop in args[0]) {
                if(args[0][prop] !== args[1][prop]) {
                    newChannel.set(prop, { old: args[0][prop], new: args[1][prop] });
                }
            }
            for(const [prop, data] of newChannel) {
                switch(prop) {
                    case "name":
                        embed.addField("Old name:", data.old);
                        embed.addField("New name:", data.new);
                        break;
                    case "parentID":
                        embed.addField("Old parent:", args[0].parent ? args[0].parent.name : "<no parent>");
                        embed.addField("New parent:", args[1].parent ? args[1].parent.name : "<no parent>");
                        break;
                    case "permissionOverwrites":
                        for(const [id, perms] of data.new) {
                            if(data.new.get(id) === data.old.get(id)) continue;

                            let msg = "";
                            const name = perms.type === "role" ? perms.channel.guild.roles.resolve(perms.id).name : perms.channel.guild.members.resolve(perms.id).tag;

                            console.log(perms.allow.bitfield, perms.deny.bitfield);
                            console.log(data.old.get(id).allow.bitfield, data.old.get(id).deny.bitfield);

                            for(var perm in Permissions.FLAGS) {
                                perm = perm.replace(/_/g, " ").toLowerCase();
                                perm = perm.substr(0, 1).toUpperCase() + perm.substr(1);
                                var newAllowed = perms.allow.bitfield & Permissions.FLAGS[perm];
                                var oldAllowed = data.old.get(id).allow.bitfield & Permissions.FLAGS[perm];
                                if(newAllowed === oldAllowed) {
                                    if((perms.deny.bitfield & Permissions.FLAGS[perm]) === (data.old.get(id).deny.bitfield & Permissions.FLAGS[perm])) {
                                        continue;
                                    }
                                }
                                // Use emoji as they're shorter than discords :name:
                                msg += perm + ": " + (perms.allow.bitfield & Permissions.FLAGS[perm] ? "✅" : (perms.deny.bitfield & Permissions.FLAGS[perm] ? ":x:" : "➖")) + "\n";
                            }
                            if(msg) {
                                embed.addField("Permission overwrites for " + name + ":", msg);
                            }
                        }
                        break;
                }
            }
            if(!embed.fields.length) return null;
            return embed;
        case "channelPinsUpdate":
            embed.setTitle("Message pinned");
            embed.setDescription("New message pinned in <#" + args[0].id + ">");
            return embed;
        case "messageDelete":
            var msg = args[0];
            embed.setTitle("Message deleted");
            embed.setAuthor(msg.author.tag, msg.author.avatarURL());
            embed.setDescription(msg.content || "[EMBED]");
            return embed;
        case "messageDeleteBulk":
            embed.setTitle("Purged " + args[0].size + " messages");
            var authors = new Map();
            for(const [, msg] of args[0]) {
                authors.set(msg.author.tag, authors.get(msg.author.tag) + 1 || 1);
            }
            embed.description = "";
            for(const [author, messages] of authors) {
                embed.description += author + ": " + messages + " message" + (messages ? "s" : "") + "\n";
            }
            embed.description = embed.description.trim();
            if(embed.description.length > 1023) {
                embed.setDescription("Too many authors to show");
            }
            return embed;
        case "messageUpdate":
            const data = {
                old: args[0],
                msg: args[1]
            };
            if(data.old.content === data.msg.content) return null;
            embed.setTitle("Message edited in <#" + data.old.channel.id + ">");
            embed.setURL(data.msg.url);
            embed.setAuthor(data.old.author.tag, data.old.author.avatarURL());
            embed.addField("Old message:", data.old.content);
            embed.addField("New message:", data.msg.content);
            return embed;
        case "emojiCreate":
            var [emoji] = args;
            embed.setTitle("Emoji created");
            embed.setDescription("Emoji " + (emoji.requiresColons ? ":" + emoji.name + ": (" + emoji.name + ")" : emoji.name) + " created.");
            return embed;
        case "emojiDelete":
            var [emoji] = args;
            embed.setTitle("Emoji deleted");
            embed.setDescription("Emoji " + (emoji.requiresColons ? ":" + emoji.name + ": (" + emoji.name + ")" : emoji.name) + " deleted.");
            return embed;
        case "emojiUpdate":
            var [emoji, newEmoji] = args;
            embed.setTitle("Emoji updated");
            embed.setDescription("Emoji " + (emoji.requiresColons ? ":" + emoji.name + ": (" + emoji.name + ")" : emoji.name) + " updated to " + (newEmoji.requiresColons ? ":" + newEmoji.name + ": (" + newEmoji.name + ")" : newEmoji.name) + ".");
            return embed;
        case "guildBanAdd":
            var [guild, user] = args;
            var ban = args[0].fetchBan(args[1]);
            embed.setTitle("User " + user.tag + " was banned from " + guild.name);
            embed.description = ban.reason || "No reason provided";
            return embed;
        case "guildBanRemove":
            var [guild, user] = args;
            var ban = args[0].fetchBan(args[1]);
            embed.setTitle("User " + user.tag + " was unbanned from " + guild.name);
            embed.description = ban.reason || "No reason provided";
            return embed;
        case "guildMemberAdd":
            var member = args[0];
            embed.setTitle("User joined");
            embed.setDescription("User " + member.displayName + " (" + member.user.tag + ") just joined " + member.guild.name + "!");
            return embed;
        case "guildMemberRemove":
            var member = args[0];
            embed.setTitle("User left");
            embed.setDescription("User " + member.displayName + " (" + member.user.tag + ") just left " + member.guild.name + "!");
            return embed;
        case "guildUpdate": // TODO: implement guild update, member update and other missing events
        case "guildMemberUpdate":
        case "roleUpdate":
            return null;
        case "inviteCreate":
            var [invite] = args;
            embed.setTitle("Invite created");
            embed.setDescription("Invite for <#" + invite.channel.id + ">");
            embed.setTimestamp();
            embed.addField("Code:", invite.code);
            embed.addField("Expires:", invite.expiresAt ? `${invite.expiresAt.getHours()}:${invite.expiresAt.getMinutes().toString().padStart(2, "0")} ${invite.expiresAt.getDate()}. ${invite.expiresAt.getMonth() + 1} ${invite.expiresAt.getYear()}` : "never");
            embed.addField("Maximum uses:", invite.maxUses || "infinite");
            embed.addField("Created by:", invite.inviter ? invite.inviter.tag : "unknown");
            if(invite.temporary) embed.addField("Temporary", "This invite is temporary");
            return embed;
        case "inviteDelete":
            var [invite] = args;
            embed.setTitle("Invite deleted");
            embed.setDescription("Invite to <#" + invite.channel.id + "> got deleted");
            return embed;
        case "roleCreate":
            var [role] = args;
            embed.setTitle("Role created");
            embed.setDescription("Role <@&" + role.id + "> (" + role.name + ") just got created.");
            return embed;
        case "roleDelete":
            var [role] = args;
            embed.setTitle("Role created");
            embed.setDescription("Role <@&" + role.id + "> (" + role.name + ") was deleted.");
            return embed;
    }
}

function getGuild(realEvent, data) {
    switch(realEvent) {
        case "messageDeleteBulk":
            return data[0].first().guild;
        case "messageUpdate":
        case "messageDelete":
        case "inviteDelete":
        case "inviteCreate":
        case "guildMemberRemove":
        case "guildMemberAdd":
        case "emojiDelete":
        case "emojiUpdate":
        case "emojiCreate":
        case "channelUpdate":
        case "channelPinsUpdate":
        case "channelDelete":
        case "channelCreate":
        case "roleCreate":
        case "roleDelete":
        case "roleUpdate":
            return data[0].guild;
        case "guildUpdate":
        case "guildIntegrationsUpdate":
        case "guildBanRemove":
        case "guildBanAdd":
            return data[0];
    }
}

// TODO: Implement user update

module.exports = async (realEvent, event, data) => {
    const guild = getGuild(realEvent, data);
    if(!guild) return;

    const logs = getLogs(guild);

    for(const log of logs) {
        if(!match(event, log.settings)) continue;
        const channel = guild.channels.resolve(log.id);
        var formatted = await format(data, realEvent);
        if(formatted) {
            channel.send(formatted);
        }
    }
};
