const commando = require("@iceprod/discord.js-commando");
const { parse } = require("node-html-parser");
const got = require("got");
const newEmbed = require("../../embed");

module.exports = class PIP extends commando.Command {
    constructor(client) {
        super(client, {
            name: "pip",
            memberName: "pip",
            group: "dev",
            description: "Gets info about Python Package on PIP Package",
            usage: "pip <pkg>",
            args: [
                {
                    key: "pkg",
                    type: "string",
                    prompt: "Which PIP package to get info about?"
                }
            ]
        });
    }

    async run(msg, cmd) {
        try {
            await got("https://pypi.org/project/" + cmd.pkg).then(res => {
                const root = parse(res.body);
                var name = root.querySelector(".package-header__name").text;
                var url = "https://pypi.org/project/" + cmd.pkg;
                var desc = root.querySelector(".package-description__summary").text;
                var info = root.querySelectorAll(".sidebar-section")[3].childNodes;
                var license = info[3].text.split(": ")[1];
                var author = info[5].text.split(": ")[1];

                var embed = newEmbed();
                embed.setTitle(name);
                embed.setDescription(desc);
                embed.setURL(url);
                embed.addField("Author", author, true);
                embed.addField("License", license, true);
                msg.channel.send(embed);
            });
        } catch(error) {
            var embed = newEmbed();
            embed.setTitle("Package Not Found");
            embed.setDescription("Couldn't find package **" + cmd.pkg + "**");
            msg.channel.send(embed);
        }
    }
};
