const newEmbed = require("../embed");

function getLogs(msg, deleted = false) {
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

function match(event, types) {
    var eventGroups = event.split(".");

    /* eslint-disable no-labels */
    typeLoop:
    for(const type of types) {
        var groups = type.split(".");
        for(const groupID in groups) {
            if(groups[groupID] !== eventGroups[groupID] && eventGroups[groupID] !== "*") {
                continue typeLoop;
            }
        }
        return true;
    }
    /* eslint-enable no-labels */
    return false;
}

function format(data, event) {
    switch(event) {
        case "message.edit":
            const embed = newEmbed();
            embed.setTitle("Message edited");
            embed.setTimestamp(new Date());
            return embed;
    }
}

module.exports = (msg, event, data) => {
    var logs = getLogs(msg);

    for(const log of logs) {
        if(!match(event, log.settings)) continue;
        const channel = msg.guild.channels.get(log.id);
        channel.send(format(data, event));
    }
};
