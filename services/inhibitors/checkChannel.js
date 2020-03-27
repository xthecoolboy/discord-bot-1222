module.exports = msg => {
    if(msg.guild.settings.get("allowedChannels", false)){
        if(!msg.guild.settings.get("allowedChannels").includes(msg.channel.id)){
            return "You can't use Ice in this channel!";
        }
    }
}