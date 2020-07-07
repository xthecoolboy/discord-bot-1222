const commando = require("@iceprod/discord.js-commando");
const userInfo = require("./info/user");

module.exports = class Stats extends commando.Command {
    constructor(client) {
        super(client, {
            name: "profile",
            memberName: "profile",
            group: "mod",
            description: "Shows user profile",
            aliases: ["user", "member"],
            args: [
                {
                    key: "user",
                    type: "user",
                    prompt: "What user to get info about?",
                    default: ""
                }
            ]
        });
    }

    async run(msg, { user }) {
        return userInfo(msg, { pointer: user });
    }
};
