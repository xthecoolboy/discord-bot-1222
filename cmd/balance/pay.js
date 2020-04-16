/* eslint-disable no-unused-vars */
const commando = require("@iceprod/discord.js-commando");
const account = require("../../managers/accountManager");
const Discord = require("discord.js");

module.exports = class Pay extends commando.Command {
    constructor(client) {
        super(client, {
            name: "pay",
            memberName: "pay",
            group: "balance",
            description: "Pays someone BBS",
            hidden: true,
            args: [
                {
                    prompt: "Who to pay?",
                    type: "user",
                    key: "user"
                }
            ]
        });
    }

    run(msg, cmd) {
        msg.channel.send("To be done");
    }
};
