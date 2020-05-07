const commando = require("@iceprod/discord.js-commando");
const newEmbed = require("../../embed");
const got = require("got");

module.exports = class DStatus extends commando.Command {
    constructor(client) {
        super(client, {
            name: "dstatus",
            memberName: "dstatus",
            group: "dev",
            description: "Shows status of discord services."
        });
    }

    async run(msg) {
        var lang = await msg.guild.lang();
        var embed = newEmbed();

        got("https://srhpyqt94yxb.statuspage.io/api/v2/summary.json").then(summary => {
            got("https://srhpyqt94yxb.statuspage.io/api/v2/incidents.json").then(incidents => {
                var sum = JSON.parse(summary.body);
                var inc = JSON.parse(incidents.body);
                var output = "";
                sum.components.forEach(component => {
                    var status = component.status === "operational";
                    output += (status ? ":white_check_mark:" : ":x:") + " **" + component.name + "**: *" + component.status + "*\n";
                });
                embed.setDescription(output);
                var last = inc.incidents[0];
                embed.addField(lang.dstatus.latest, "[" + last.name + "](" + last.shortlink + ")\n" + lang.dstatus.status + ": **" + last.status + "**");
                msg.channel.send(embed);
            });
        });
    }
};
