const Discord = require('discord.js');
const newEmbed = require("../../embed");
const got = require("got");

class Invite {
    getName() {
        return "dstatus";
    }
    getDesc() {
        return "Shows discord services status";
    }
    async exec(cmd, client, msg) {
        cmd.shift();
        var embed = newEmbed();
        
        got("https://srhpyqt94yxb.statuspage.io/api/v2/summary.json").then(summary => {
            got("https://srhpyqt94yxb.statuspage.io/api/v2/incidents.json").then(incidents => {
                var sum = JSON.parse(summary.body);
                var inc = JSON.parse(incidents.body);
                var output = "";
                sum.components.forEach(component => {
                    var status = component.status == "operational";
                    output += (status ? ":white_check_mark:" : ":x:") + " **" + component.name + "**: *" + component.status + "*\n";
                });
                embed.setDescription(output);
                var last = inc.incidents[0];
                embed.addField("Latest incident", "[" + last.name + "](" + last.shortlink + ")\nStatus: **" + last.status + "**");
                msg.channel.send(embed);
            })
        })
    }
}

module.exports = new Invite;