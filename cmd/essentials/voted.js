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
        var lang = await msg.guild.lang();
        msg.channel.send(lang.voted[(!!msg.author.hasVoted()).toString()].replace("%s", "https://top.gg/bot/" + this.client.user.id));
    }
};
