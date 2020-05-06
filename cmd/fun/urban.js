const commando = require("@iceprod/discord.js-commando");
const newEmbed = require("../../embed");
const got = require("got");

module.exports = class Urban extends commando.Command {
    constructor(client) {
        super(client, {
            name: "urban",
            aliases: ["ud"],
            memberName: "urban",
            description: "Find the meaning in the Urban Dictionary",
            usage: "urban <text>",
            group: "fun",
            hidden: true,
            args: [{
                type: "string",
                key: "text",
                prompt: "What is the word do you want to look up?"
            }]
        });
    }

    async run(msg, cmd) {
        try {
            var r = await got("https://mashape-community-urban-dictionary.p.rapidapi.com/define?term=" + encodeURI(cmd.text), {
                headers: {
                    "x-rapidapi-host": "mashape-community-urban-dictionary.p.rapidapi.com",
                    "x-rapidapi-key": "5bfd40b74dmsh24c1dff6c53254ep1a3d24jsn44d02f3d0d69"
                }
            });
        } catch(e) {
            return msg.channel.send("Couldn't fetch definition");
        }

        var body = JSON.parse(r.body);

        var embed = newEmbed();

        if(body.list.length === 0) {
            embed.setTitle("Undefined");
            embed.setDescription("This word isn't defined in Urban Dictionary");
            msg.channel.send(embed);
        } else {
            var popular = body.list[0];
            var regex = new RegExp(/\[[^\]]*]/g);

            var def = popular.definition;
            def = def.replace(regex, function(match, token) {
                return match.replace(/\[([a-z0-9 ]+)\]/gi, (w, group) => {
                    return `[${group}](https://www.urbandictionary.com/define.php?term=${encodeURI(group)})`;
                });
            });

            var exp = popular.example;
            exp = exp.replace(regex, function(match, token) {
                return match.replace(/\[([a-z0-9 ]+)\]/gi, (w, group) => {
                    return `[${group}](https://www.urbandictionary.com/define.php?term=${encodeURI(group)})`;
                });
            });

            embed.setTitle(popular.word);
            embed.setDescription(def);
            embed.setURL(popular.permalink);
            embed.addField((popular.word === "bruh" ? "bruh" : "Example"), "*" + exp + "*");
            embed.addField((popular.word === "bruh" ? "bruh" : "Thumbs Up"), (popular.word === "bruh" ? popular.thumbs_up + " bruhs" : ":+1: " + popular.thumbs_up));
            msg.channel.send(embed);
        }
    }
};
