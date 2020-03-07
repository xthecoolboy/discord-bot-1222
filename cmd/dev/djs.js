const Discord = require('discord.js');
const newEmbed = require("../../embed");
const tick = ":white_check_mark:";
const cross = ":x:";
const got = require('got');
const Doc = require('discord.js-docs');

class LogMe {
    getName() {
        return "djs";
    }
    getDesc() {
        return "Searches in discord.js docs";
    }
    async exec(cmd, client, msg) {
        cmd.shift();
        this.msg = msg;
        if (!cmd[0]) {
            msg.channel.send("Specify query to search. Use as `ice djs <query> [source]`. Use . to separate properties like `ice djs message.guild.members`.");
            return;
        }
        var source = (cmd[1] ? cmd[1] : "stable");
        const doc = await Doc.fetch(source)
        
        var c = cmd[0].split(".");
        var m = doc.get(...c);
        if(m){
            return this.showDoc(m, source);
        }
        this.showSearch(doc.search(c[c.length - 1]), source, c[c.length - 1]);
    }
    showDoc(m, source){
        var embed = newEmbed();
        embed.setTitle(m.name);
        embed.setDescription(m.description);
        embed.setURL(`https://discord.js.org/#/docs/main/${source}/class/${m.name}`)
        embed.addField("Properties", m.props.map(e => "`" + e.name + "`").join(", "));
        embed.addField("Methods", m.methods.map(e => "`" + e.name + "`").join(", "));
        this.msg.channel.send(embed);
    }
    showSearch(d, source, q) {
        var embed = newEmbed();
        embed.setTitle("Search results for *" + q + "*:");
        var out = "";
        d.forEach(m => {
            var url = `https://discord.js.org/#/docs/main/${source}/class/${m.name}`;
            out += "[" + m.name + "](" + url + ")\n";
        });
        
        embed.setDescription(out);
        this.msg.channel.send(embed);
    }
}

module.exports = new LogMe;