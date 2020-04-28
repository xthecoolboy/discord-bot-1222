const ytdl = require("ytdl-core");
const got = require("got");
// eslint-disable-next-line
const Discord = require("discord.js"); // Used for JSDoc
const newEmbed = require("../../embed");
const config = require("../../config.json");

const defaultOptions = {
    quality: "highestaudio"
};

class Player {
    /**
     * @param {Discord.Guild} guild
     * @returns {object[]} queue
     */
    async getQueue(guild) {
        return await guild.settings.get("music.queue", []);
    }

    /**
     * @param {Discord.guild} guild
     * @returns {Number}
     */
    async getPlayingId(guild) {
        return await guild.settings.get("music.playing", -1);
    }

    /**
     * @param {Discord.guild} guild
     * @returns {Object}
     */
    async getPlaying(guild) {
        return await this.getQueue(guild)[await this.getPlayingId(guild)];
    }

    /**
     * Shuffles array in place
     * @param {Array} a items to shuffle
     * @return {Array} shuffled
     */
    shuffle(a) {
        for(let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            if(i === j) continue;
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    /**
     * @param {String} search
     * @returns {Object[]}
     */
    async listVideos(search) {
        var res = await got("https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&key=" + config.youtube.token + "&q=" + search);
        var results = JSON.parse(res.body).items;
        results = results.map(r => {
            return { ...r.snippet, ...r.id };
        });
        return results;
    }

    /**
     * @param {Discord.Guild} guild
     * @param {Discord.Message} msg
     * @param {String} url
     * @return {void}
     */
    async play(msg, url) {
        var guild = msg.guild;
        if(!guild.voice) {
            throw new Error("not_connected");
        }
        if(ytdl.validateURL(url) || ytdl.validateID(url)) {
            var queue = await this.getQueue(guild);
            queue.push({
                url,
                requested: msg.author.id,
                data: (await ytdl.getInfo(url))
            });
            return await guild.settings.set("music.queue", queue);
        } else {
            var possibles = await this.listVideos(url);
            await guild.settings.set("music.stash", possibles);
            var embed = newEmbed();
            embed.setTitle(`Found ${possibles.length} videos, reply with number to select:`);
            embed.setDescription("Command will be canceled after 30 seconds");

            for(var num in possibles) {
                embed.addField(parseInt(num) + 1, possibles[num].title);
            }

            var sent = await msg.channel.send(embed);

            var collector = msg.channel.createMessageCollector(m => {
                // eslint-disable-next-line eqeqeq
                var filter = parseInt(m.content.trim()) == m.content.trim() && m.author.id === msg.author.id;
                return filter;
            }, { time: 30000 });

            var selected = null;

            collector.on("collect", async m => {
                selected = m.content;
                collector.stop("collected");
                var stash = await guild.settings.get("music.stash");
                var url = stash[selected - 1];
                if(!url) {
                    return msg.channel.send("Number is out of range (1-" + stash.size + ")");
                }
                await guild.settings.set("music.stash", []);
                var queue = await this.getQueue(guild);

                while(true) {
                    try {
                        var data = await ytdl.getInfo(url.videoId);
                        break;
                    } catch(e) {}
                }

                queue.push({
                    url: url.videoId,
                    requested: msg.author.id,
                    data
                });
                await guild.settings.set("music.queue", queue);
                embed.fields = [];
                embed.addField(selected, stash[selected - 1].title);
                embed.setTitle("Added song to queue");

                sent.edit(embed);
            });

            collector.on("end", async () => {
                if(!selected) {
                    var embed = newEmbed();
                    embed.setTitle("Nothing selected");
                    sent.edit(embed);
                }
            });
        }
    }

    getEmbed({ data, url, requested }) {
        var embed = newEmbed();

        embed.setTitle(data.title);
        embed.setAuthor(data.author.name, data.author.avatar, data.author.channel_url);
        embed.setURL(data.video_url);

        embed.addField("Likes", `${data.likes} / ${data.dislikes}`);
        embed.addField("Requested by", `<@!${requested}>`);

        return embed;
    }
}

module.exports = new Player();
