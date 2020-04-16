const commando = require("@iceprod/discord.js-commando");

module.exports = class Lenny extends commando.Command {
    constructor(client) {
        super(client, {
            name: "lenny",
            memberName: "lenny",
            description: "Everyone knows what's lenny",
            group: "fun"
        });
    }

    run(msg) {
        msg.channel.send("( ͡° ͜ʖ ͡°)");
    }
};
