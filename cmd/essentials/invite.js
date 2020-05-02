const commando = require("@iceprod/discord.js-commando");

module.exports = class Invite extends commando.Command {
    constructor(client) {
        super(client, {
            name: "invite",
            memberName: "invite",
            group: "essentials",
            description: "Shows bot invite link"
        });
    }

    run(msg) {
        // const inviteURL = "https://discordapp.com/api/oauth2/authorize?client_id=654725534365909043&permissions=8&scope=bot";
        const inviteURL = "https://top.gg/bot/" + this.client.user.id;
        msg.channel.send(inviteURL);
    }
};
