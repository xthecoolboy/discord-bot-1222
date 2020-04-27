const commando = require("@iceprod/discord.js-commando");
const account = require("../../managers/accountManager");

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
        var dbuser = await account.fetchUser(msg.author.id);
        if(dbuser.donor_tier > 0) {
            msg.channel.send("Congratulations! You have premium. Try some premium commands!");
        } else {
            msg.channel.send("You don't have premium. For information to get premium, go to https://iceproductions.dev/premium");
        }
    }
};
