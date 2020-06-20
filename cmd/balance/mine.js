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
        var lang = await msg.guild.lang();
        var localLocale = moment();
        localLocale.locale(await msg.guild.settings.get("lang", "en"));
        try {
            var mined = await account.mine(await account.fetchUser(msg.author.id));
            if(mined === true) {
                msg.channel.send(lang.mine.done.replace("%s", await account.getMoney(await account.fetchUser(msg.author.id))));
            } else {
                msg.channel.send(lang.mine.not_yet + (localLocale(new Date(mined + Date.now())).fromNow()) + ".");
            }
        } catch(e) {
            console.warn(e);
            msg.channel.send(lang.mine.error);
        }
    }
};
