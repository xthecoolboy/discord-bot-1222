require("../utils");

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

module.exports = async function pages(msg, embed, em, moderates, pagenumber, name, getResource) {
    if(!getResource) {
        getResource = m => `${m.sr_display_name_prefixed} (${m.subscribers.withCommas ? m.subscribers.withCommas() : m.subscribers})`;
    }
    const moddedSubs = embed.fields[embed.fields.length - 1];
    moddedSubs.value = "";
    for(let i = 10 * (pagenumber - 1); i < 10 * pagenumber; i++) {
        if(moderates[i]) moddedSubs.value += `**${i + 1}.** ${getResource(moderates[i]).withCommas ? getResource(moderates[i]).withCommas() : getResource(moderates[i])}\n`;
    }
    if(moderates.length > 10) embed.fields[embed.fields.length - 1].name = `Top ${name} (Page ${pagenumber})`;

    em.edit(embed);

    if(moderates.length > 10) {
        await em.react("⬅");
        await em.react("➡");
        const filter = (reaction, user) => user.id === msg.author.id;
        const collector = em.createReactionCollector(filter, { time: 30000 });
        collector.on("collect", async (reaction) => {
            reaction.users.remove(msg.member);
            switch(reaction.emoji.name) {
                case "⬅":
                    if(pagenumber === 1) return;
                    pagenumber--;
                    moddedSubs.value = "";
                    for(let i = 10 * (pagenumber - 1); i < 10 * pagenumber; i++) {
                        if(moderates[i]) moddedSubs.value += `**${i + 1}.** ${getResource(moderates[i]).withCommas()}\n`;
                    }
                    em.edit(embed);
                    break;
                case "➡":
                    if(moderates.length <= pagenumber * 10) return;
                    pagenumber++;
                    moddedSubs.value = "";
                    for(let i = 10 * (pagenumber - 1); i < 10 * pagenumber; i++) {
                        if(moderates[i]) moddedSubs.value += `**${i + 1}.** ${getResource(moderates[i]).withCommas()}\n`;
                    }
                    em.edit(embed);
                    break;
            }
        });
        collector.on("end", () => em.reactions.removeAll());
    }
};
