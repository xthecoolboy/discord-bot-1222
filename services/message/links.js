const got = require("got");
const TOKEN = require("../../config.json").virustotal;
const FormData = require("form-data");
const newEmbed = require("../../embed");

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
module.exports = async (msg) => {
    if(msg.author.bot) return;
    if(/(.* )?https?:\/\/[a-z.]{3,}\.[a-z]{2,}(\/[^ ])*( .*)?/i.test(msg.content)) {
        console.log("Found link in message");
    } else return;

    var url = msg.content.match(/(.* )?(https?:\/\/[a-z.]{3,}\.[a-z]{2,}(\/[^ ]*)*)( .*)?/i)[2];

    console.log("Checking link", url);
    var form = new FormData();

    form.append("apiKey", TOKEN);
    form.append("url", url);

    const embed = newEmbed();
    embed.setTitle("Scanning link, please wait...");

    var ne = await msg.channel.send(embed);

    await got("https://www.virustotal.com/vtapi/v2/url/scan", {
        method: "POST",
        body: form
    });
    console.log("Submitted for review");

    await sleep(500);

    var reportRaw = await got("https://www.virustotal.com/vtapi/v2/url/report?apiKey=" + TOKEN + "&resource=" + url);
    var report = JSON.parse(reportRaw.body);

    console.log("Got response");

    if(report.positives) {
        embed.setTitle(`Link was marked as malicious by ${report.positives} sources.`);
        embed.setDescription(`The page was scanned by VirusTotal by ${report.total} sources. Click the title for more info.`);
        embed.setURL(report.permalink);
        embed.setColor("RED");
        ne.edit(embed);
    } else {
        embed.setTitle("Link is safe");
        embed.setDescription(`The link was scanned by VirusTotal by ${report.total} sources. Click the title for more info.`);
        embed.setURL(report.permalink);
        embed.setColor("GREEN");
        ne.edit(embed);

        await sleep(5000);
        ne.delete();
    }
};
