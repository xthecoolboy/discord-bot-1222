const commando = require("@iceprod/discord.js-commando");
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
        await msg.author.fetchUser();
        try {
            var mined = await msg.author.mine();
            if(mined === true) {
                msg.channel.send(lang.mine.done.replace("%s", await msg.author.money));
            } else {
                const localLocale = moment(new Date(mined + Date.now()));
                localLocale.locale(await msg.guild.settings.get("lang", "en"));
                console.log(localLocale);
                msg.channel.send(lang.mine.not_yet + (localLocale.fromNow() || "later") + ".");
            }
        } catch(e) {
            console.warn(e);
            msg.channel.send(lang.mine.error);
        }
    }
};
