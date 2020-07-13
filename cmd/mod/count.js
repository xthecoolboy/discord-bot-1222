const commando = require("@iceprod/discord.js-commando");
const newEmbed = require("../../embed");

module.exports = class Count extends commando.Command {
    constructor(client) {
        super(client, {
            name: "count",
            memberName: "count",
            alias: ["usercount"],
            group: "mod",
            description: "Shows information about members of this channel",
            guildOnly: true
        });
    }

    async run(msg) {
        this.msg = msg;

        if(msg.channel.type === "dm") {
            msg.channel.send("We are the only one's in DMs");
            return;
        }

        var guild = msg.guild;

        var userCount = guild.memberCount;
        var users = guild.members.cache.filter(m => !m.user.bot);
        var onlineCount = users.filter(m => m.presence.status === "online").size;
        var offlineCount = users.filter(m => m.presence.status === "offline").size;
        var dndCount = users.filter(m => m.presence.status === "dnd").size;
        var sleepCount = users.filter(m => m.presence.status === "idle").size;
        var webCount = users.filter(m => m.presence.clientStatus && m.presence.clientStatus.web).size;
        var mobileCount = users.filter(m => m.presence.clientStatus && m.presence.clientStatus.mobile).size;
        var desktopCount = users.filter(m => m.presence.clientStatus && m.presence.clientStatus.desktop).size;
        var botsCount = guild.members.cache.filter(m => m.user.bot).size;
        userCount -= botsCount;

        var embed = newEmbed();
        embed.setTitle("Statistics");
        embed.setDescription(
            ":white_circle: Total users: " + userCount + "\n" +
            ":green_circle: Online users: " + onlineCount + "\n" +
            ":no_entry: DND users: " + dndCount + "\n" +
            ":crescent_moon: Idle users: " + sleepCount + "\n" +
            ":black_circle: Offline users: " + offlineCount + "\n" +
            ":desktop: Desktop users: " + desktopCount + "\n" +
            ":iphone: Mobile users: " + mobileCount + "\n" +
            ":globe_with_meridians: Web users: " + webCount + "\n" +
            ":robot: Bots: " + botsCount + "\n"
        );

        if(msg.alias === "count") {
            embed.footer.text += " | Use usercount alias next time.";
        }

        msg.channel.send(embed);
    }
};
