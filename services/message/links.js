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
    if(checkChannel(msg) && DEV) return;
    if(!DEV) {
        if(msg.channel.id === "692839951611723877" || msg.channel.id === "695610745085231104") return;
    }
    if(/(.* )?https?:\/\/[a-z.]{3,}\.[a-z]{2,}(\/[^ ])*( .*)?/i.test(msg.content)) {
        console.log("Found link in message");
    } else return;

    var url = msg.content.match(/(.* )?(https?:\/\/[a-z.]{3,}\.[a-z]{2,}(\/[^ ]*)*)( .*)?/i)[2];

    console.log("Checking link", url);

    const embed = newEmbed();
    embed.setTitle("Scanning link, please wait...");

    var ne = await msg.channel.send(embed);

    var resp;
    try {
        console.log("Submitting...");
        resp = await got("https://www.virustotal.com/vtapi/v2/url/scan", {
            method: "POST",
            body: formEncode({
                apikey: TOKEN,
                url
            }),
            timeout: 1000
        });
        console.log(resp.body);
    } catch(e) {
        console.error(e);
        try {
            // console.log(e.response);
        } catch(e) {}
        return;
    }
    console.log("Submitted for review");

    await sleep(500);

    var reportRaw = await got("https://www.virustotal.com/vtapi/v2/url/report?apikey=" + TOKEN + "&resource=" + url);
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
if(!TOKEN) {
    module.exports = () => {};
}
