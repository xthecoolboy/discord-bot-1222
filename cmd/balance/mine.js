const commando = require("@iceprod/discord.js-commando");
const account = require("../../managers/accountManager");
const moment = require("moment");

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
            if(mined === true) {
                msg.channel.send("Successfully mined BBS! Your current balance is " + await account.getMoney(await account.fetchUser(msg.author.id)));
            } else {
                msg.channel.send("You can't mine yet. Try again " + (moment(new Date(mined + Date.now())).fromNow() || "later") + ".");
            }
        } catch(e) {
            console.warn(e);
            msg.channel.send("An error occured during mining BBS.");
        }
    }
};
