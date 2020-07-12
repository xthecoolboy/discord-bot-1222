module.exports = async msg => {
    var blacklist = await msg.client.provider.get("global", "userBlacklist", []);
    if(blacklist.includes(msg.author.id)) {
        return "blacklisted";
    }
    if(msg.guild) {
        if(msg.content === await msg.guild.settings.get("prefix", msg.client.commandPrefix) + "channels clear" && msg.member.permissions.has("MANAGE_CHANNELS")) {
            try {
                await msg.guild.settings.set("allowedChannels", []);
                msg.say("All channels are now allowed :smile:");
            } catch(e) {
                throw new Error("Error occurred with clearing allowed channels");
            };
            return "Channels cleared";
        }

        const channels = await msg.guild.settings.get("allowedChannels", []);
        if(channels.length) {
            if(!channels.includes(msg.channel.id)) {
                return "You can't use Aztec in this channel!";
            }
        }
    }
};
