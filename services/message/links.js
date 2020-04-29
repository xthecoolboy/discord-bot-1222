const got = require("got");
const TOKEN = require("../../config.json").virustotal;
const DEV = require("../../config.json").dev;
const formEncode = require("form-urlencoded").default;
const newEmbed = require("../../embed");
const checkChannel = require("../inhibitors/checkChannel");

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
module.exports = async (msg) => {
    if(msg.author.bot) return;
    if(!msg.guild) return;
    var member = await msg.guild.member(msg.author);
    if(member.roles.length) return;
    if(checkChannel(msg) && DEV) return;
    if(!DEV) {
        if(msg.channel.id === "692839951611723877" || msg.channel.id === "695610745085231104") return;
    }
    if(/(.* )?https?:\/\/[a-z.]{3,}\.[a-z]{2,}(\/[^ ])*( .*)?/i.test(msg.content)) {
    } else return;

    var url = msg.content.match(/(.* )?(https?:\/\/[a-z.]{3,}\.[a-z]{2,}(\/[^ ]*)*)( .*)?/i)[2];

    console.log("Scanning URL", url, "from", msg.author.tag, "in", msg.guild.name);

    const embed = newEmbed();

    try {
        await got("https://www.virustotal.com/vtapi/v2/url/scan", {
            method: "POST",
            body: formEncode({
                apikey: TOKEN,
                url
            }),
            timeout: 1000
        });
    } catch(e) {
        return;
    }

    await sleep(5000);

    var reportRaw = await got("https://www.virustotal.com/vtapi/v2/url/report?apikey=" + TOKEN + "&resource=" + url);
    var report = JSON.parse(reportRaw.body);

    if(report.positives) {
        embed.setTitle(`Link was marked as malicious by ${report.positives} sources.`);
        embed.setDescription(`The page was scanned by VirusTotal by ${report.total} sources. Click the title for more info.`);
        embed.setURL(report.permalink);
        embed.setColor("RED");
        try {
            await msg.channel.send(embed);
        } catch(e) {}
    } else {
        embed.setTitle("Link is safe");
        embed.setDescription(`The link was scanned by VirusTotal by ${report.total} sources. Click the title for more info.`);
        embed.setURL(report.permalink);
        embed.setColor("GREEN");
        try {
            //var s = await msg.channel.send(embed);
        } catch(e) {}

        //await sleep(2000);
       // s.delete();
    }
};
if(!TOKEN) {
    module.exports = () => {};
}
