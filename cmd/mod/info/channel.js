const newEmbed = require("../../../embed");

module.exports = (msg, cmd) => {
    const channel = (cmd.pointer ? msg.guild.channels.resolve(cmd.pointer) : msg.channel);
    if(cmd.pointer && !channel) return msg.say("Channel not found");

    const embed = newEmbed()
        .setAuthor(msg.author.tag, msg.author.avatarURL())
        .setTitle(channel.name)
        .addField("ID", channel.id, true)
        .addField("NSFW", channel.nsfw ? "Yes :smiling_imp:" : "No :slight_smile:", true)
        .addField("Members", channel.members.size, true);
    if(channel.topic) embed.setDescription(channel.topic);
    return msg.embed(embed);
};
