const commando = require("@iceprod/discord.js-commando");

module.exports = class Pay extends commando.Command {
    constructor(client) {
        super(client, {
            name: "pay",
            memberName: "pay",
            group: "balance",
            description: "Pays someone BBS",
            args: [
                {
                    prompt: "Who to pay?",
                    type: "user",
                    key: "user"
                },
                {
                    prompt: "What amount to pay?",
                    type: "float",
                    key: "amount"
                }
            ]
        });
    }

    async run(msg, { user, amount }) {
        var lang = await msg.guild.lang();
        amount *= 1000;
        if(msg.author.id === user.id) {
            return msg.channel.send(lang.pay.self);
        }
        await msg.author.fetchUser();
        await user.fetchUser();

        if(msg.author.bbs < amount) {
            return msg.channel.send(lang.pay.too_low);
        }
        if(amount < 1) {
            return msg.channel.send(lang.pay.nothing);
        }

        await msg.author.pay(user.db_id, amount);
        msg.channel.send(lang.pay.done);
        await user.sendAchievementUnique(msg, "buyer");
    }
};
