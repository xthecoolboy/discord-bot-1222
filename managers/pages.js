const { numberWithCommas } = require("../utils");

/**
 * Pagify list
 * @param {*} msg Message
 * @param {*} embed Embed
 * @param {*} em embed pointer
 * @param {Array<any>} moderates array to show list of
 * @param {Number} pagenumber current page
 * @param {String} name of resource
 * @param {Function} getResource function returning formatted string
 */
async function pages(msg, embed, em, moderates, pagenumber, name, getResource) {
    if(!getResource) {
        getResource = m => `${m.sr_display_name_prefixed} (${numberWithCommas(m.subscribers)})`;
    }
    const moddedSubs = embed.fields[embed.fields.length - 1];
    moddedSubs.value = "";
    for(let i = 10 * (pagenumber - 1); i < 10 * pagenumber; i++) {
        if(moderates[i]) moddedSubs.value += `**${i + 1}.** ${getResource(moderates[i])}\n`;
    }
    if(moderates.length > 10) {
        embed.fields[embed.fields.length - 1].name = `Top ${name} (Page ${pagenumber})`;
    }

    em.edit(embed);

    if(moderates.length > 10) {
        const filter = (reaction, user) => user.id === msg.author.id;
        const collector = em.createReactionCollector(filter, { time: 15000 });
        await em.react("⬅");
        if(moderates.length >= pagenumber * 10) em.react("➡");
        collector.on("collect", async (reaction) => {
            switch(reaction.emoji.name) {
                case "⬅":
                    await reaction.remove(msg.author.id);
                    if(pagenumber === 1) return;
                    collector.endReason = "Reaction";
                    collector.stop();
                    pages(msg, embed, em, moderates, pagenumber - 1, name, getResource);
                    break;
                case "➡":
                    await reaction.remove(msg.author.id);
                    if(moderates.length <= (pagenumber + 1) * 10)await reaction.remove();
                    collector.endReason = "Reaction";
                    collector.stop(reaction.user);
                    pages(msg, embed, em, moderates, pagenumber + 1, name, getResource);
                    break;
            }
        });
        collector.on("end", collected => {
            if(collector.endReason !== "Reaction") em.reactions.forEach(reaction => reaction.remove());
        });
    }
}

module.exports = pages;
