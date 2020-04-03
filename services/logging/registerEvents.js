const log = require("./logger");
const fs = require("fs");
const readline = require("readline");
const path = require("path");

const readInterface = readline.createInterface({
    input: fs.createReadStream(path.join(__dirname, "mappings.yaml")),
    output: process.stdout,
    console: false
});

const map = new Map();

readInterface.on("line", function(line) {
    line = line.split(":");
    if(!line[1]) return;
    map.set(line[0], line[1]);
});

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
