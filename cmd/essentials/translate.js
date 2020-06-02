const commando = require("@iceprod/discord.js-commando");
const got = require("got");

module.exports = class Translate extends commando.Command {
    constructor(client) {
        super(client, {
            name: "translate",
            aliases: ["t"],
            memberName: "translate",
            group: "essentials",
            description: "Translate string or previous message",
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

    async translate(text, target) {
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
            return "Target language or source text is invalid!";
        }
    }

    async run(msg, { target, text }) {
        if(text) {
            return msg.channel.send(await this.translate(text, target) || "Couldn't translate given text to " + target + ".");
        }
        msg.channel.send(await this.translate(msg.channel.messages.cache.last(2)[0].content, target) || "Couldn't translate last message to " + target + ".");
    }
};
