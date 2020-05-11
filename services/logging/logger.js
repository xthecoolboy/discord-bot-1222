const newEmbed = require("../../embed");

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

function format(args, event) {
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
        case "channelPinsUpdate":
            return null;
        case "channelUpdate":
            embed.setTitle("Channel updated - #" + args[1].name);
            embed.addField("Old channel data:", "```json\n" + JSON.stringify(args[0], null, 2) + "\n```");
            embed.addField("New channel data:", "```json\n" + JSON.stringify(args[1], null, 2) + "\n```");
            return embed;
        case "messageUpdate":
            const data = {
                old: args[0],
                msg: args[1]
            };
            if(data.old.content === data.msg.content) return null;
            embed.setTitle("Message edited");
            embed.setURL(data.msg.url);
            embed.setAuthor(data.old.author.tag, data.old.authoravatarURL());
            embed.addField("Old message:", data.old.content);
            embed.addField("New message:", data.msg.content);
            return embed;
    }
}

function getGuild(realEvent, data) {
    switch(realEvent) {
        case "messageUpdate":
            return data.guild;
    }
}

module.exports = (realEvent, event, data) => {
    const guild = getGuild(realEvent, data);
    if(!guild) return;

    const logs = getLogs(guild);

    for(const log of logs) {
        if(!match(event, log.settings)) continue;
        const channel = guild.channels.get(log.id);
        var formatted = format(data, realEvent);
        if(formatted) {
            channel.send(formatted);
        }
    }
};
