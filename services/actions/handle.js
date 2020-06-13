/*
This file is NOT to be included by index, rather it's
supposed to be included by registerEvents from logging
as it already has code to convert events into the bots
form.
*/

const { getGuild } = require("../../utils");
const client = require("../../managers/pool_mysql");
const { exec } = require("child_process");
const { join } = require("path");
const sl = require("singleline");

module.exports = async (realEvent, event, data) => {
    const guild = getGuild(realEvent, data);
    if(!guild) return;

    console.log("Checking event " + event + " in " + guild.id);

    const [res] = await client.query("SELECT * FROM actions a, actions_connections ac, guilds g WHERE ac.guild = g.snowflake AND ac.action = a.id AND g.snowflake = ? AND CheckRuleset(?, a.eventRules) = true", [guild.id, event]);

    for(var action of res) {
        var code = sl(`
            import {
                Client,
                Channel,
                EventType,
                Event,
                NewMessageEvent,
                Message,
                SentMessage,
                Guild,
                EmbedField,
                EmbedFooter,
                EmbedAuthor,
                Embed,
                User
            } from "./actions/lib/main.ts";

            const client = await Client.newClient("692837502117216307", "654725534365909043", ${JSON.stringify(data)}, ${action.env});
        `);
        code += action.code;

        try {
            var script = null;

            var timeout = setTimeout(() => {
                console.log("Deno timeout in actions");
                script.kill();
            }, 2e4);

            /* eslint-disable no-inner-declarations */
            function end(err, stdout, stderr) {
                if(err) {
                    console.error(err);
                }

                clearTimeout(timeout);
                console.log({ stdout });
                console.warn({ stderr });
            }
            /* eslint-enable no-inner-declarations */

            try {
                code = `'${code.replace(/'/g, "'\\''")}'`;
                script = exec("PWD=" + join(__dirname, "../../actions/") + "NO_COLOR=true ~/.local/bin/deno eval " + code, end);
            } catch(e) {
                console.error("[error_cmd]", e);
                return;
            }
        } catch(e) {
            console.error("Action failed");
        }
    }
};
