const fs = require("fs");
const vm2 = require("vm2");
const walkSync = require("walk-sync");
const path = require("path");
const util = require("util");

class Argument {
    constructor(data) {
        const argumentProps = [
            "type", "prompt", "default", "key", "infinite"
        ];

        for(const key in data) {
            if(!argumentProps.includes(key)) continue;
            this[key] = data[key];
        }

        for(const key of argumentProps) {
            if(!this[key]) {
                if(key === "infinite") {
                    this[key] = false;
                } else {
                    this[key] = "";
                }
            }
        }
    }
}

class Command {
    constructor(path) {
        var contents = fs.readFileSync(path);
        var match = /super\(client, ({((?!this\.client)(?!run(?!\?))[\s\S])*})\);/mi.exec(contents);
        if(!match) {
            return null;
        };

        var vm = new vm2.NodeVM();

        var code = "module.exports = " + match[1];
        var data = vm.run("module.exports = " + code);

        this.parse(data);
    }

    parse(data) {
        const allowedProps = [
            "name", "group", "description", "examples", "aliases", "usage", "args"
        ];
        const mappings = {
            args: "arguments"
        };

        for(const prop in data) {
            if(allowedProps.includes(prop)) {
                if(mappings[prop]) {
                    this[mappings[prop]] = data[prop];
                } else {
                    this[prop] = data[prop];
                }
            }
        }

        for(const argument in this.arguments) {
            this.arguments[argument] = new Argument(this.arguments[argument]);
        }

        for(let prop of allowedProps) {
            if(mappings[prop]) {
                prop = mappings[prop];
            }
            if(!this[prop]) {
                if(["arguments", "aliases", "examples"].includes(prop)) {
                    this[prop] = [];
                } else {
                    this[prop] = "";
                }
            }
        }
    }
}

const commands = walkSync(path.join(__dirname, "..", "cmd"), {
    directories: false,
    includeBasePath: true
});

var commandList = [];

for(const command of commands) {
    try {
        var cmd = new Command(command);
        if(cmd) {
            commandList.push(cmd);
        }
    } catch(e) {}
}

commandList = commandList.filter(val => val.name);

var cmdMap = {};
for(const command of commandList) {
    cmdMap[command.name] = command;
}

console.log("/* eslint-disable */\nmodule.exports =", util.inspect(cmdMap, false, Infinity, false).replace(/: Command {/g, ": {").replace(/ Argument {/g, "{").replace(/ {2}/g, "    ")); // JSON.stringify(cmdMap, null, 4));
