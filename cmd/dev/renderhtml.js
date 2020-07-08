const commando = require("@iceprod/discord.js-commando");
const phantomJsCloud = require("phantomjscloud");
const newEmbed = require("../../embed");
const pool = require("../../managers/pool_mysql");
const browser = new phantomJsCloud.BrowserApi(require("../../config.json").phantomjs);

module.exports = class RenderHTML extends commando.Command {
    constructor(client) {
        super(client, {
            name: "renderhtml",
            memberName: "renderhtml",
            aliases: ["render", "html"],
            group: "dev",
            description: "Renders given HTML",
            args: [
                {
                    key: "url",
                    type: "url",
                    prompt: "Which page to render?"
                }
            ],
            throttling: {
                usages: 1,
                duration: 15
            }
        });
    }

    async run(msg, { url }) {
        url = url.toString();
        var m;
        try {
            m = await msg.channel.send("Rendering...");
            var embed = newEmbed();

            embed.setTitle("Page render of " + url);

            var r = await pool.query("SELECT * FROM shortener.images WHERE url = ? LIMIT 1", [url]);
            if(r[0] && r[0][0]) {
                embed.setImage("http://go-dan.tk/jpg/" + r[0][0].id + "/image.jpg");

                m.edit("", embed);
                return;
            }

            const resp = await browser.requestSingle({
                url,
                renderType: "jpg",
                renderSettings: {
                    quality: 90,
                    viewport: {
                        height: 728,
                        width: 1366
                    },
                    zoomFactor: 1,
                    passThroughHeaders: false,
                    emulateMedia: "screen",
                    omitBackground: false,
                    passThroughStatusCode: false
                }
            });
            if(resp.statusCode !== 200)throw new Error("Error happened");

            var res = await pool.execute("INSERT INTO shortener.images (url, data) VALUES (?, ?)", [url, "data:image/JPG;base64," + resp.content.data]);
            embed.setImage("http://go-dan.tk/jpg/" + res[0].insertId + "/image.jpg");

            await m.edit("", embed);
        } catch(e) {
            console.warn("[ERROR](renderhtml)", e);
            if(m) {
                return m.edit("Coudln't render page. Try again later.");
            } else {
                return msg.channel.send("Coudln't render page. Try again later.");
            }
        }
    }
};
