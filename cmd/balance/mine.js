const commando = require("discord.js-commando");
const account = require("../../managers/accountManager");
const TimeAgo = require("javascript-time-ago");
const en = require("javascript-time-ago/locale/en");
TimeAgo.addLocale(en);

module.exports = class Mine extends commando.Command {
    constructor(client) {
        super(client, {
            name: "mine",
            memberName: "mine",
            group: "balance",
            description: "Mines BBS, once per 12 hours."
        });
    }

    async run(msg) {
        try {
            var mined = await account.mine(await account.fetchUser(msg.author.id));
            if(mined) {
                msg.channel.send("Successfully mined BBS! Your current balance is " + await account.getMoney(await account.fetchUser(msg.author.id)));
            } else {
                msg.channel.send("You can't mine yet.");
            }
        } catch(e) {
            console.warn(e);
            msg.channel.send("An error occured during mining BBS.");
        }
    }
};
