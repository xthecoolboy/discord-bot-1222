const commando = require("@iceprod/discord.js-commando");
const newEmbed = require("../../embed");
const { exec } = require("child_process");

module.exports = class Deno extends commando.Command {
    constructor(client) {
        super(client, {
            name: "deno",
            memberName: "deno",
            group: "dev",
            description: "Runs given code or URL in deno",
            args: [
                {
                    type: "string",
                    key: "code",
                    prompt: "Enter code to execute (or use URL)"
                }
            ]
        });
    }

    /**
     *
     * @param {commando.CommandoMessage} msg
     * @param {commando.Argument} param1
     */
    async run(omsg, { code }) {
        try {
            var msg = await omsg.channel.send("Executing...");
            var script = null;

            var timeout = setTimeout(() => {
                console.log("Deno timeout");
                msg.edit("Took too long, killed");
                script.kill();
            }, 2e4);

            /* eslint-disable no-inner-declarations */
            function end(err, stdout, stderr) {
                if(err) {
                    console.error(err);
                }

                clearTimeout(timeout);

                // Dirty fix, don't know the source...
                if(stdout.substr(stdout.length - 9) === "undefined") { stdout = stdout.substr(0, stdout.length - 9); }

                stdout = stdout.substr(0, 1018);
                stderr = stderr.substr(0, 1018);

                var embed = newEmbed();
                embed.setTitle("Command");
                embed.setDescription(script.exitCode === 0 ? "Done" : "failed");
                embed.addField("Command", "```js\n" + code.replace(/``/gmi, "`​`") + "\n```");
                embed.addField("Stdout", `\`\`\`${stdout.replace(/``/gmi, "`​`").replace(/file:\/\/\/home\/ubuntu\/bots/, "./") || " "}\`\`\``);
                embed.addField("Stderr", `\`\`\`${stderr.replace(/``/gmi, "`​`").replace(/file:\/\/\/home\/ubuntu\/bots/, "./") || " "}\`\`\``);
                msg.edit("", embed);
            }
            /* eslint-enable no-inner-declarations */

            try {
                var file;
                if(code.startsWith("http://") || code.startsWith("https://")) {
                    file = `'${code.replace(/'/g, "'\\''")}'`;
                    script = exec("NO_COLOR=true ~/.local/bin/deno " + file, end);
                } else {
                    file = `'${code.replace(/'/g, "'\\''")}'`;
                    script = exec("NO_COLOR=true ~/.local/bin/deno eval " + file, end);
                    /* script.stdin.write(code);
                    script.stdin.end(); */
                }
            } catch(e) {
                console.error("[error_cmd]", e);
                var embed = newEmbed();
                embed.setTitle("Command");
                embed.addField("Command", "```js\n" + code.replace(/``/gmi, "`​`") + "\n```");
                embed.setDescription("Failed");
                msg.edit("", embed);
                return;
            }
        } catch(e) {
            console.error("[Error]", e);
            omsg.channel.send("An error occured.\nYou shouldn't ever receive an error like this.\nPlease contact TechmandanCZ#0135 in this server: https://discord.gg/dZtq4Qu");
        }
    }
};
