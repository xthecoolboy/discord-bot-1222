/*
This file is NOT to be included by index, rather it's
supposed to be included by registerEvents from logging
as it already has code to convert events into the bots
form.
*/

const { getGuild } = require("../../utils");
const client = require("../../managers/pool_mysql");
const { spawn } = require("child_process");
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

            const client = await Client.newClient("692837502117216307", "654725534365909043", "${realEvent}", ${JSON.stringify(data)}, ${action.env});
            const event = await client.getEvent();
        `);
        code += action.code;

        try {
            var script = null;

            var timeout = setTimeout(() => {
                console.log("Deno timeout in actions");
                script.kill();
            }, 2e4);

            /* eslint-disable no-inner-declarations */
            async function end(stdout, stderr, err) {
                clearTimeout(timeout);

                await client.execute("INSERT INTO action_runs (action, guild, stdout, stderr, err) VALUES (?,?,?,?,?)", [action.id, guild.id, stdout, stderr, err.toString()]);
            }
            /* eslint-enable no-inner-declarations */

            try {
                script = spawn("deno", ["eval", code], {
                    env: {
                        ...process.env,
                        CWD: join(__dirname, "../../actions/"),
                        NO_COLOR: true
                    }
                });

                var dataBuf = "";
                script.stdout.on("data", data => {
                    dataBuf += data;
                });
                var errBuf = "";
                script.stderr.on("data", data => {
                    errBuf += data;
                });
                script.on("error", error => {
                    end(dataBuf, errBuf, error);
                });
                script.on("close", code => {
                    end(dataBuf, errBuf, "");
                });
            } catch(e) {
                console.error("[error_cmd]", e);
                return;
            }
        } catch(e) {
            console.error("Action failed");
        }
    }
};
