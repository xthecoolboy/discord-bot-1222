const log = require("./logger");

const mappings = [

];

const map = new Map(mappings);

module.exports = client => {
    for(var event in map) {
        var eventName = map[event];

        client.on(event, (msg, ...args) => {
            if(msg.author.bot) return;
            if(msg.channel.id === "692839951611723877" && client.user.id !== "527453262639792138") return;

            log(msg, eventName, [msg, ...args]);
        });
    }
};
