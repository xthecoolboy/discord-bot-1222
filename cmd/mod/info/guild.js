const newEmbed = require("../../../embed");

module.exports = (msg, cmd) => {
    const embed = newEmbed();
    embed.setAuthor(msg.author.tag, msg.author.avatarURL);
    embed.setTitle(msg.guild.name);
    embed.setThumbnail(msg.guild.iconURL);
    embed.addField("Owner", msg.guild.owner, true)
        .addField("Region", msg.guild.region, true)
        .addField("Categories", msg.guild.channels.filter(c => c.type === "category").size, true)
        .addField("Text Channels", msg.guild.channels.filter(c => c.type === "text").size, true)
        .addField("Voice Channels", msg.guild.channels.filter(c => c.type === "voice").size, true)
        .addField("Roles", msg.guild.roles.size, true)
        .addField("Members", msg.guild.members.size, true)
        .addField("Humans", msg.guild.members.filter(m => !m.user.bot).size, true)
        .addField("Bots", msg.guild.members.filter(m => m.user.bot).size, true);
    if(msg.guild.bannerURL) embed.setImage(msg.guild.bannerURL);
    embed.setFooter(`${embed.footer.text} | Server Created: ${msg.guild.createdAt.getDate()}/${msg.guild.createdAt.getMonth()}/${msg.guild.createdAt.getFullYear()}`);
    return msg.embed(embed);
};
