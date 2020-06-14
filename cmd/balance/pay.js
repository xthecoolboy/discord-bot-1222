const commando = require("@iceprod/discord.js-commando");
const account = require("../../managers/accountManager");

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
        amount *= 1000;
        if(msg.author.id === user.id) {
            return msg.channel.send("As much as sending money to yourself may be a good idea, don't forget that there may be taxes for payments in future");
        }
        var source = await account.fetchUser(msg.author.id);
        var target = await account.fetchUser(user.id);
        if(source.bbs < amount) {
            return msg.channel.send("You don't have enough BBS.");
        }
        await account.pay(source.id, target.id, amount);
        msg.channel.send("Sent!");
    }
};
