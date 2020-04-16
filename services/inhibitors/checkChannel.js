module.exports = async msg => {
    var blacklist = await msg.client.provider.get("global", "userBlacklist", []);
    if(blacklist.includes(msg.author.id)) {
        return "blacklisted";
    }
    if(msg.guild) {
        if(msg.guild.settings.get("allowedChannels", false)) {
            if(!msg.guild.settings.get("allowedChannels").includes(msg.channel.id)) {
                return "You can't use Ice in this channel!";
            }
        }
    }
};
