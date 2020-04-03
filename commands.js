const Discord = require("discord.js");
const randomPuppy = require("./reddit");
const { readdirSync } = require("fs");

const newEmbed = require("./embed");
const ascii = require("ascii-table");

// Create a new Ascii table
const table = new ascii("Commands");
table.setHeading("Command", "Load status");

var modules = {};
modules.commands = new Discord.Collection();
modules.aliases = new Discord.Collection();

readdirSync("./cmd/").forEach(dir => {
    const commands = readdirSync(`./cmd/${dir}/`).filter(file => file.endsWith(".js"));

    for(const file of commands) {
        try {
            delete require.cache[require.resolve(`./cmd/${dir}/${file}`)];
            const pull = require(`./cmd/${dir}/${file}`);
            if(pull.disabled) {
                table.addRow(`${dir}/${file}`, "❌ -> plugin disabled");
                continue;
            } else if(typeof pull.getName === "function") {
                modules.commands.set(pull.getName(), pull);
                table.addRow(`${dir}/${file}`, "✅");
            } else {
                table.addRow(`${dir}/${file}`, "❌  -> couldn't get name.");
                continue;
            }

            if(pull.getAliases && Array.isArray(pull.getAliases())) { pull.getAliases().forEach(alias => modules.aliases.set(alias, pull.getName())); }
        } catch(e) {
            table.addRow(file, "❌ -> " + e);
        }
    }
});
// Log the table
console.log(table.toString());
// console.log(modules.commands);

module.exports = async (client, msg, prefix) => {
    var message = msg.content.substr(prefix.length, msg.content.length - prefix.length);
    // console.log(message);
    var cmd = [];
    var pointer = 0;
    var inQuotes = 0;
    for(var i = 0; i < message.length; i++) {
        var char = message.charAt(i);
        // console.log("[PARSE] p:" + pointer + " q:" + inQuotes + " cmd: " + cmd);
        if(char == "\"" && inQuotes != 2) {
            (inQuotes == 1 ? inQuotes == 0 : inQuotes == 1);
            continue;
        }if(char == "'" && inQuotes != 1) {
            (inQuotes == 2 ? inQuotes == 0 : inQuotes == 2);
            continue;
        }
        if(char == " ") {
            pointer++;
            continue;
        }
        if(cmd[pointer] != undefined) {
            cmd[pointer] += char;
        } else {
            cmd[pointer] = char;
        }
    }
    try {
        if(!msg.member) msg.member = await msg.guild.fetchMember(msg);
    } catch(e) {
        console.warn("Fetch member failed. DM?");
        // console.warn(e);
    }
    // Get the command
    let command = modules.commands.get(cmd[0]);
    // If none is found, try to find it by alias
    if(!command) command = modules.commands.get(modules.aliases.get(cmd[0]));

    if(command) {
        if(command.exec(cmd, client, msg) == "special::help") {
            cmdHelp();
        }
    } else {
        cmdNotFound();
    }

    function cmdHelp() {
        var embed = newEmbed();
        embed.setTitle("Help");
        /* modules.commands.array().forEach((cmd, i)=>{
            embed.addField("`ice "+cmd.getName()+"`", cmd.getDesc());
        }); */
        embed.setDescription("For documentation, see [docs](http://ice.danbulant.eu/docs)");
        msg.channel.send(embed);
    }
    function cmdNotFound() {
        console.log("Couldn't find command " + cmd[0]);
        msg.channel.send("Couldn't find command");
    }
};
