/*
This file is NOT to be included by index, rather it's
supposed to be included by registerEvents from logging
as it already has code to convert events into the bots
form.
*/

const { getGuild } = require("../../utils");
const client = require("../../managers/pool_mysql");

module.exports = async (realEvent, event, data) => {
    const guild = getGuild(realEvent, data);
    if(!guild) return;

    console.log("Checking event " + event + " in " + guild.id);

    const [res] = await client.query("SELECT * FROM actions a, actions_connections ac, guilds g WHERE ac.guild = g.snowflake AND ac.action = a.id AND g.snowflake = ? AND CheckRuleset(?, a.eventRules) = true", [guild.id, event]);

    for(var action of res) {
        console.log("Found action " + action.name + " to be run.");
    }

    console.log("Actions done");
};
