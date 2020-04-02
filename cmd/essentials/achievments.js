const user = require("../../managers/accountManager");
const commando = require("discord.js-commando");

module.exports = class Achievments extends commando.Command {
    constructor(client) {
        super(client, {
            name: "achievments",
            memberName: "achievments",
            group: "essentials",
            description: "List all your achievments"
        });
    }

    async run(msg) {
        var id = await user.fetchUser(msg.author.id);
        id = id.id;

        var achievmentsAwarded = await user.achievments(id);
        achievmentsAwarded.forEach(a => {
            msg.channel.send(user.sendAchievment(a, msg, false));
        });

        if(achievmentsAwarded.length === 0) {
            msg.channel.send("You don't have any achievments... yet.");
        }
    }
};
