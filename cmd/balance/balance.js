const commando = require("discord.js-commando");
const account = require("../../managers/accountManager");
const TimeAgo = require("javascript-time-ago");
const en = require("javascript-time-ago/locale/en");
TimeAgo.addLocale(en);

module.exports = class Balance extends commando.Command {
    constructor(client) {
        super(client, {
            name: "balance",
            memberName: "balance",
            group: "balance",
            aliases: ["bal"],
            description: "Shows yours BBS balance. More in `info user`"
        });
    }

    async run(msg) {
        msg.channel.send("Your current balance is " + await account.getMoney(await account.fetchUser(msg.author.id)));
    }
};
