const commando = require("@iceprod/discord.js-commando");
const Discord = require("discord.js");
const newEmbed = require("../../embed");

module.exports = class Avatar extends commando.Command {
    constructor(client) {
        super(client, {
            name: "avatar",
            memberName: "avatar",
            aliases: ["av"],
            group: "essentials",
            description: "Shows yours (or someone else's) avatar",
            args: [
                {
                    default: "",
                    prompt: "User to check on?",
                    key: "user",
                    type: "user"
                }
            ]
        });
    }

    async run(msg, cmd) {
        var lang = await msg.guild.lang();
        var user = null;
        if(!cmd.user) {
            user = msg.author;
        } else if(cmd.user instanceof Discord.User) {
            user = cmd.user;
        } else {
            var id = cmd.user.substr(2, cmd.user.length - 3);
            if(id.substr(0, 1) === "!")id = id.substr(1);
            try {
                user = await this.client.fetchUser(id);
            } catch(e) {
                msg.channel.send(lang.avatar.not_found);
                return;
            }
            if(!user) {
                msg.channel.send(lang.avatar.not_found);
                return;
            }
        }
        var embed = newEmbed();
        embed.setTitle(user.username);
        embed.setImage(user.displayAvatarURL({
            dynamic: true,
            size: 2048
        }));
        msg.channel.send(embed);
    }
};
