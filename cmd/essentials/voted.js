const commando = require("@iceprod/discord.js-commando");

module.exports = class Voted extends commando.Command {
    constructor(client) {
        super(client, {
            name: "voted",
            aliases: ["vote"],
            memberName: "voted",
            group: "essentials",
            description: "Checks your vote status"
        });
    }

    async run(msg) {
        if(await msg.author.hasVoted()) {
            msg.channel.send("You already voted, all vote-locked commands are available!");
        } else {
            msg.channel.send("You haven't voted yet. You can vote at https://top.gg/bot/" + this.client.user.id);
        }
    }
};
