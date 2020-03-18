const Discord = require('discord.js');
const newEmbed = require("../../embed");
const util = require("../../utils.js");
const tick = ":white_check_mark:";
const cross = ":x:";
const got = require('got');

class LogMe {
    getName() {
        return "request";
    }
    getAliases() {
        return ['req'];
    }
    getDesc() {
        return "Make a request to the given URL with options. See `request help`.";
    }
    exec(cmd, client, msg) {
        cmd.shift();
        this.msg = msg;
        this.cmd = cmd;
        if (!cmd[0]) {
            msg.channel.send("You must specify subcommand. See `request help`.");
            return;
        }
        this.command(cmd[0]);
    }
    command(cmd){
        switch(cmd.toLowerCase()){
            case "help":
                this.showHelp();
                break;
            case "get":
                this.startGet();
                break;
            default:
                this.msg.channel.send("Unknown subcommand. See `request help`.");
        }
    }
    filter(obj, predicate) {
        var result = {}, key;

        for (key in obj) {
            if (obj.hasOwnProperty(key) && predicate(obj[key])) {
                result[key] = obj[key];
            }
        }

        return result;
    }
    async startGet(){
        var embed = newEmbed();
        embed.setTitle(util.assistant_icon);
        embed.setDescription("Performing request");
        var msg = await this.msg.channel.send(embed);
        if(!this.cmd[1]){
            return this.msg.channel.send("Specify a url. Usage: `ice request <url> [json|text (default]");
        }
        got(this.cmd[1]).then(res => {
            embed.setTitle("GET")
            embed.setDescription("Request results:");
            embed.addField("Response code", res.statusCode + " (Don't understand the code meaning? See `ice code " + res.statusCode + "`)");
            var headers = this.filter(res.headers, o => typeof o != "array");
            var head = "";
            var key = "";
            for (key in headers) {
                if (headers.hasOwnProperty(key)) {
                    head += key + ": '" + headers[key] + "'\n";
                }
            }

            embed.addField("Headers", "```\n" + head + "```");
            if(res.headers["set-cookie"])
                embed.addField("Cookies", "```\n" + res.headers["set-cookie"].join("\n") + "```");
            embed.addField("HTTP", "` HTTP/" + res.httpVersion + " GET `");
            if(res.body.length > 1016){
                embed.addField("Error", "Response body is longer than discord's limit. The body below is truncated to fit.");
                embed.addField("Response truncated", "```\n" + res.body.substr(0, 1016) + "\n```");
            } else {
                if(!this.cmd[2]){
                    embed.addField("Response", "```\n" + res.body + "\n```");
                } else if (this.cmd[2].toLowerCase() == "json") {
                    try {
                        embed.addField("Response", "```json\n" + JSON.stringify(JSON.parse(res.body), null, 2) + "\n```");
                    } catch(e) {
                        embed.addField("An error occured during JSON parse:", "```\n" + e.name + " - " + e.description + "\n```\n");
                        embed.addField("Response", "```\n" + res.body + "\n```");
                    }
                } else {
                    embed.addField("Response", "```\n" + res.body + "\n```");
                }
            }
            msg.edit(embed);
        }).catch(e => {
            console.log("Error in request:");
            console.warn(e);
            var embed = newEmbed();
            embed.setTitle("GET - error");
            embed.setDescription(e.name + " => " + e.description);

            msg.edit(embed);
        });
    }
    showHelp(){
        var embed = newEmbed();
        embed.setTitle("Request");
        embed.setDescription("Make HTTP(s) requests");
        embed.addField("`help`", "show this help");
        embed.addField("`get`", "performs GET request. Add `json` to pretty print json. Usage: `ice request get <url> [json]");

        this.msg.channel.send(embed);
    }
}

module.exports = new LogMe;