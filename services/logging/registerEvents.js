const log = require("./logger");
const fs = require("fs");
const path = require("path");

const map = new Map();

(() => {
    const mapping = fs.readFileSync(path.join(__dirname, "mappings.yaml"), "utf-8");

    for(var line of mapping.split("\n")) {
        line = line.split(":");
        if(!line[1] || line[1] === "null") continue;
        map.set(line[0], line[1]);
    }
})();

module.exports = client => {
    for(const [event, eventName] of map) {
        client.on(event, (...args) => {
            log(event, eventName, [...args]);
        });
    }
};
