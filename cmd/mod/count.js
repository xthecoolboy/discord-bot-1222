const commando = require("discord.js-commando");
const newEmbed = require("../../embed");

module.exports = class Count extends commando.Command{
    constructor(client){
        super(client, {
            name: "count",
            memberName: "count",
            group: "mod",
            description: "Shows information about members of this channel"
        })
    }
    async run(msg) {
        this.msg = msg;

        if(msg.channel.type == "dm"){
            msg.channel.send("We are the only one's in DMs");
            return;
        }

        var guild = msg.guild;

        var userCount = guild.memberCount;
        var onlineCount = guild.members.filter(m => m.presence.status === 'online').filter(m => !m.user.bot).size;
        var offlineCount = guild.members.filter(m => m.presence.status === 'offline').filter(m => !m.user.bot).size;
        var dndCount = guild.members.filter(m => m.presence.status === 'dnd').filter(m => !m.user.bot).size;
        var sleepCount = guild.members.filter(m => m.presence.status === 'idle').filter(m => !m.user.bot).size;
        var botsCount = guild.members.filter(m => m.user.bot).size;
        userCount -= botsCount;

        var embed = newEmbed();
        embed.setTitle("Statistics");
        embed.setDescription(
            ":white_circle: Total users: " + userCount + "\n" +
            ":green_circle: Online users: " + onlineCount + "\n" +
            ":no_entry: DND users: " + dndCount + "\n" +
            ":crescent_moon: Idle users: " + sleepCount + "\n" +
            ":black_circle: Offline users: " + offlineCount + "\n" +
            ":robot: Bots: " + botsCount
        );

        msg.channel.send(embed);
    }
}