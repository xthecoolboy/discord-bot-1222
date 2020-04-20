const commando = require("@iceprod/discord.js-commando");
const got = require("got");
const newEmbed = require("../../embed");
const { numberWithCommas } = require("../../utils");

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
        const data = await got("https://api.covid19api.com/summary", {
            responseType: "json",
            resolveBodyOnly: true
        });
        if(!data) return msg.say("Something went wrong when fetching information...");

        let country = cmd.country;
        if(country !== "Global") {
            country = (data.Countries.filter(c => c.CountryCode.includes(cmd.country.toUpperCase()))[0] || data.Countries.filter(c => c.Country.toLowerCase().includes(cmd.country.toLowerCase()))[0]);
            if(!country) return msg.say("Country not found");
        } else country = data.Global;

        const embed = newEmbed();
        if(country.Country) embed.addField("Country", country.Country);
        embed
            .setTitle("COVID-19 Information")
            .setColor("RED")
            .setURL("https://www.worldometers.info/coronavirus/")
            .addFields(
                { name: "Total Cases", value: numberWithCommas(country.TotalConfirmed) },
                { name: "New Cases", value: numberWithCommas(country.NewConfirmed) },
                { name: "Total Deaths", value: numberWithCommas(country.TotalDeaths) },
                { name: "New Deaths", value: numberWithCommas(country.NewDeaths) },
                { name: "Total Recovered", value: numberWithCommas(country.TotalRecovered) },
                { name: "New Recovered", value: numberWithCommas(country.NewRecovered) }
            );
        msg.say(embed);
    }
};
