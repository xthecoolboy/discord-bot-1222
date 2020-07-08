const commando = require("@iceprod/discord.js-commando");

module.exports = class Balance extends commando.Command {
    constructor(client) {
        super(client, {
            name: "balance",
            memberName: "balance",
            group: "balance",
            aliases: ["bal"],
            description: "Shows yours BBS balance. More in `info user`",
            args: [
                {
                    type: "member",
                    default: "",
                    key: "target",
                    prompt: "Which user to get balance from?"
                }
            ]
        });
    }

    async run(msg, { target }) {
        var lang = await msg.guild.lang();
        var user = target.user || msg.author;
        await user.fetchUser();
        if(target) {
            msg.channel.send(lang.balance.target_desc.replace("%u", target.displayName).replace("%n", user.money));
        } else {
            msg.channel.send(lang.balance.desc.replace("%n", user.money));
        }
    }
};
