const commando = require("@iceprod/discord.js-commando");
const donors = require("../../donors");

module.exports = class Premium extends commando.Command {
    constructor(client) {
        super(client, {
            name: "premium",
            memberName: "premium",
            group: "balance",
            description: "Information about premium and if you have active premium."
        });
    }

    async run(msg) {
        if(!donors.includes(msg.author.id)) {
            msg.channel.send("You don't have premium. For information to get premium, go to http://ice.danbulant.eu/premium");
            return;
        }
        msg.channel.send("Congratulations! You have premium. Try some premium commands!");
    }
};
