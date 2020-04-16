module.exports = async msg => {
    var blacklist = await msg.client.provider.get("global", "userBlacklist", []);
    if(blacklist.includes(msg.author.id)) {
        console.log("User blacklisted");
        return "blacklisted";
    }
    if(msg.guild) {
        if(msg.guild.settings.get("allowedChannels", false)) {
            if(!msg.guild.settings.get("allowedChannels").includes(msg.channel.id)) {
                console.log("Blocked channel");
                return "You can't use Ice in this channel!";
            }
        }
    }
};
