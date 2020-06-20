const commando = require("@iceprod/discord.js-commando");
const got = require("got");
const newEmbed = require("../../embed");
require("../../utils");

module.exports = class Covid extends commando.Command {
    constructor(client) {
        super(client, {
            name: "covid",
            aliases: ["covid19", "corona", "coronavirus", "covidinfo", "coronainfo"],
            memberName: "covid",
            group: "essentials",
            description: "Shows recent information about COVID-19",
            usage: "covid [country]",
            args: [
                {
                    type: "string",
                    key: "country",
                    default: "Global",
                    prompt: "which countrys stats do you want to see?"
                }
            ]
        });
    }

    async run(msg, cmd) {
        var lang = await msg.guild.lang();
        const data = await got("https://api.covid19api.com/summary", {
            responseType: "json",
            resolveBodyOnly: true
        });
        if(!data) return msg.say(lang.covid.error);

        let country = cmd.country;
        if(country !== "Global") {
            country = (data.Countries.filter(c => c.CountryCode.includes(cmd.country.toUpperCase()))[0] || data.Countries.filter(c => c.Country.toLowerCase().includes(cmd.country.toLowerCase()))[0]);
            if(!country) return msg.say(lang.covid.country_not);
        } else country = data.Global;

        const embed = newEmbed();
        if(country.Country) embed.addField(lang.covid.country, country.Country);
        embed
            .setTitle("COVID-19 Information")
            .setColor("RED")
            .setURL("https://www.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6")
            .addFields(
                { name: lang.covid.cases.total, value: country.TotalConfirmed.withCommas() },
                { name: lang.covid.cases.new, value: country.NewConfirmed.withCommas() },
                { name: lang.covid.cases.tdeaths, value: country.TotalDeaths.withCommas() },
                { name: lang.covid.cases.ndeaths, value: country.NewDeaths.withCommas() },
                { name: lang.covid.cases.trecovered, value: country.TotalRecovered.withCommas() },
                { name: lang.covid.cases.nrecovered, value: country.NewRecovered.withCommas() }
            );
        const em = await msg.say(embed);

        if(cmd.country !== "Global") {
            const stats = await got(`https://api.covid19api.com/total/country/${country.Slug}`, {
                responseType: "json",
                resolveBodyOnly: true
            });
            const confirmed = stats.slice(-10).map(r => r.Confirmed);
            const deaths = stats.slice(-10).map(r => r.Deaths);
            const { months } = lang.general;
            const dates = stats.slice(-10).map(r =>
                months[parseInt(r.Date.substring(5, 7)) - 1] + " " + parseInt(r.Date.substring(8, 10))
            );
            embed
                .addField("\u200b", lang.covid.graph.replace("%n", 10))
                .setImage("https://quickchart.io/chart?c=" + encodeURIComponent(`{type:'bar',data:{labels:${JSON.stringify(dates)}, datasets:[{label:'Confirmed',data:${JSON.stringify(confirmed)}},{label:'Deaths',data:${JSON.stringify(deaths)}}]}}`));
            em.edit(embed);
        }
    }
};
