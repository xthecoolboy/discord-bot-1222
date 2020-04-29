const { MessageEmbed } = require("discord.js");
module.exports = () => {
    var embed = new MessageEmbed()
        .setColor("#0099ff")
        // .attachFiles(['./stefanik_vlajka.jpg'])
        // .setAuthor('ČSK Bot', 'attachment://stefanik_vlajka.jpg', 'https://danbulant.eu')
        // .setTimestamp()
        .setFooter("© ICE Bot, TechmandanCZ#0135 and Noah#6809");
    return embed;
};
