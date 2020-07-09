const newEmbed = require("../../../embed");

module.exports = (msg, cmd) => {
    const embed = newEmbed()
        .setAuthor(msg.author.tag, msg.author.avatarURL())
        .setTitle(msg.channel.name)
        .setDescription(msg.channel.topic)
        .addField("ID", msg.channel.id, true)
        .addField("NSFW", msg.channel.nsfw, true)
        .addField("Members", msg.channel.members.size, true);
    if(msg.guild.bannerURL) embed.setImage(msg.guild.bannerURL);
    return msg.embed(embed);
};
