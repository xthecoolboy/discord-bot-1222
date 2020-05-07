const { MessageEmbed } = require("discord.js");
module.exports = () => {
    var embed = new MessageEmbed()
        .setColor("#0099ff")
        // .attachFiles(['./stefanik_vlajka.jpg'])
        // .setAuthor('ČSK Bot', 'attachment://stefanik_vlajka.jpg', 'https://danbulant.eu')
        // .setTimestamp()
        .setFooter("© Aztec, TechmandanCZ#0135 and Noah#6809", "https://cdn.discordapp.com/attachments/701351893661777930/707851114543972432/aztec.jpg");
    return embed;
};
