const commando = require("discord.js-commando");

global.started = new Date();
global.lastReload = new Date();

module.exports = class Logs extends commando.Command {
    constructor (client) {
        super(client, {
            name: "log",
            memberName: "log",
            group: "mod",
            description: "Log settings",
            hidden: true
        });
    }

    async run (msg, cmd) {
        msg.channel.send("To be done");
    }
};
