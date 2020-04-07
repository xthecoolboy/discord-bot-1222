module.exports = msg => {
    if(msg.author.id === "609343924468842517") return "No Lonely devs allowed";
    if(msg.guild) {
        if(msg.guild.settings.get("allowedChannels", false)) {
            if(!msg.guild.settings.get("allowedChannels").includes(msg.channel.id)) {
                return "You can't use Ice in this channel!";
            }
        }
    }
};
