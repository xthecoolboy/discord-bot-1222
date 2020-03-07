const {RichEmbed}= require('discord.js');
module.exports = ()=>{
    var embed = new RichEmbed()
        .setColor('#0099ff')
        //.attachFiles(['./stefanik_vlajka.jpg'])
        //.setAuthor('ČSK Bot', 'attachment://stefanik_vlajka.jpg', 'https://danbulant.eu')
        //.setTimestamp()
        .setFooter('© ICE Bot, TechmandanCZ#0135');
    return embed;
}