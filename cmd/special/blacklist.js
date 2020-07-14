const commando = require("@iceprod/discord.js-commando");
const newEmbed = require("../../embed");

module.exports = class Blacklist extends commando.Command {
    constructor(client) {
        super(client, {
            name: "blacklist",
            group: "special",
            memberName: "blacklist",
            description: "Prohibit a user from using this bot",
            throttling: {
                usages: 2,
                duration: 3
            },
            ownerOnly: true,
            args: [
                {
                    prompt: "Please select an option: `<add | remove | clear>`",
                    default: "list",
                    key: "option",
                    type: "string",
                    oneOf: ["add", "remove", "clear", "list"]

                },
                {
                    prompt: "Which users to add/remove?",
                    default: "",
                    key: "users",
                    infinite: true,
                    type: "user"
                }
            ]
        });
    }

    async run(msg, cmd) {
        for(const o of this.client.owners) {
            if(cmd.users.includes(o)) return msg.say("Bot owners can't be blacklisted!");
        }

        const list = (u) => { return !u.length ? "No users are blacklisted! :smile:" : u.map(u => `<@${u}>`).join(", "); };
        let blacklist = await this.client.provider.get("global", "userBlacklist", []);
        var embed = newEmbed().setFooter("");

        switch(cmd.option) {
            case "clear":
                blacklist = [];
                msg.client.provider.set("global", "userBlacklist", blacklist);
                embed
                    .setTitle("Done!")
                    .addField("Blacklisted users", list(blacklist));
                msg.say(embed);
                break;

            case "add":
                if(!cmd.users) return msg.say("Please specify one or more users!");
                for(const u of cmd.users) { if(!blacklist.includes(u.id)) blacklist.push(u.id); }
                msg.client.provider.set("global", "userBlacklist", blacklist);
                embed
                    .setTitle("Done!")
                    .addField("Blacklisted users", list(blacklist));
                msg.say(embed);
                break;

            case "remove":
                if(!cmd.users) return msg.say("Please specify one or more channels!");
                blacklist = blacklist.filter(id => !cmd.users.map(u => u.id).includes(id));
                msg.client.provider.set("global", "userBlacklist", blacklist);
                embed
                    .setTitle("Done!")
                    .addField("Blacklisted users", list(blacklist));
                msg.say(embed);
                break;

            default:
                embed
                    .addField("Blacklisted users", list(blacklist));
                msg.say(embed);
        }
    }
};
