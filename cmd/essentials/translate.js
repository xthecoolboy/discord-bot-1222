const commando = require("@iceprod/discord.js-commando");
const got = require("got");
const cheerio = require("cheerio");

module.exports = class Translate extends commando.Command {
    constructor(client) {
        super(client, {
            name: "translate",
            aliases: ["t"],
            memberName: "translate",
            group: "essentials",
            description: "Translate string or previous message",
            throttling: {
                usages: 3,
                duration: 10
            },
            args: [
                {
                    type: "string",
                    key: "target",
                    prompt: "What language to translate to?",
                    default: "en"
                }, {
                    type: "string",
                    key: "text",
                    prompt: "What text to translate?",
                    default: ""
                }
            ]
        });
    }

    async translate(text, target, invalid) {
        if(!text) return text;
        try {
            const data = await got("https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=" + target + "&hl=" + target + "&ddrl=5&tsel=5&kc=1&dt=t&q=" + text, {
                headers: {
                    authority: "translate.google.com",
                    pragma: "no-cache",
                    "cache-control": "no-cache",
                    dnt: "1",
                    accept: "*/*",
                    "sec-fetch-site": "same-origin",
                    "sec-fetch-mode": "cors",
                    referer: "https://translate.google.com/",
                    "accept-encoding": "gzip, deflate, br",
                    "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,hy;q=0.6,it;q=0.5"
                }
            });
            return JSON.parse(data.body)[0][0][0];
        } catch(e) {
            return invalid;
        }
    }

    async run(msg, { target, text }) {
        var lang = await msg.guild.lang();
        if(!text) {
            var last = msg.channel.messages.cache.last(2)[0];

            if(last) {
                text = await this.translate(msg.channel.messages.cache.last(2)[0].content, target, lang.translate.source);

                var dbuser = await msg.author.fetchUser();
                if(dbuser.donor_tier === 0) {
                    if(last.embeds.length) msg.channel.send(lang.translate.premium);
                    return msg.channel.send(text);
                }

                if(text === lang.translate.source) return msg.channel.send(text);

                var embeds = [];
                for(var embed of last.embeds) {
                    var fields = [];
                    for(var field of embed.fields) {
                        fields.push({
                            name: await this.translate(field.name, target, lang.translate.source),
                            value: await this.translate(field.value, target, lang.translate.source),
                            inline: field.inline
                        });
                    }
                    embeds.push({
                        ...embed,
                        description: await this.translate(embed.description, target, lang.translate.source),
                        footer: {
                            ...embed.footer,
                            text: await this.translate(embed.footer.text, target, lang.translate.source)
                        },
                        fields
                    });
                }

                if(!text) {
                    return msg.channel.send({
                        embed: embeds[0]
                    });
                }

                return msg.channel.send(
                    text,
                    embeds
                );
            }
        }
        if(target.toString().toLowerCase() === "lolcat") {
            const data = await got("https://speaklolcat.com/?from=" + text);
            const $ = cheerio.load(data.body);
            msg.channel.send($("#to").text());
            return;
        }
        return msg.channel.send(await this.translate(text, target, lang.translate.source) || lang.translate.text.replace("%s", target));
    }
};
