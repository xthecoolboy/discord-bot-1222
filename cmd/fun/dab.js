const commando = require("discord.js-commando");

module.exports = class Dab extends commando.Command {
    constructor(client) {
        super(client, {
            name: "dab",
            memberName: "dab",
            group: "fun",
            description: "DAB"
        });
    }

    run(msg) {
        msg.reply("<o/");
    }
};
