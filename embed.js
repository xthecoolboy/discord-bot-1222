const { MessageEmbed } = require("discord.js");
module.exports = () => {
    var embed = new MessageEmbed()
        .setColor("#0099ff")
        // .attachFiles(['./stefanik_vlajka.jpg'])
        // .setAuthor('ČSK Bot', 'attachment://stefanik_vlajka.jpg', 'https://danbulant.eu')
        // .setTimestamp()
        .setFooter("© ICE Bot, TechmandanCZ#0135 and Noah#6809", "https://cdn.discordapp.com/avatars/654725534365909043/09279582bbc5a3c5df04ca3a85cb4f2c.webp?size=2048");
    return embed;
};
