module.exports = async msg => {
    var blacklist = await msg.client.provider.get("global", "userBlacklist", []);
    if(blacklist.includes(msg.author.id)) {
        return "blacklisted";
    }
    if(msg.guild) {
        if(msg.content === await msg.guild.settings.get("prefix", msg.client.commandPrefix) + "channels clear" && msg.member.permissions.has("MANAGE_CHANNELS")) {
            msg.guild.settings.set("allowedChannels", [])
                .then(msg.channel.send("All channels are now allowed :smile:"))
                .catch(e => {
                    console.log(e);
                    msg.channel.send("Something went wrong...");
                });
            return "Channels cleared";
        }

        if(msg.guild.settings.get("allowedChannels", []).length) {
            if(!msg.guild.settings.get("allowedChannels").includes(msg.channel.id)) {
                return "You can't use Ice in this channel!";
            }
        }
    }
};
