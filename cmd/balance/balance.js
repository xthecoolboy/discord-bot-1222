const commando = require("@iceprod/discord.js-commando");
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
        var lang = await msg.guild.lang();
        msg.channel.send(lang.balance.desc.replace("%n", await account.getMoney(await account.fetchUser(msg.author.id))));
    }
};
