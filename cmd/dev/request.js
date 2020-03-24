const commando = require('discord.js-commando');
const newEmbed = require("../../embed");
const util = require("../../utils.js");
const got = require('got');

module.exports = class Request extends commando.Command{
    constructor(client){
        super(client, {
            name: "request",
            memberName: "request",
            aliases: ["req"],
            usage: "req get http://ice.danbulant.eu/ text",
            group: "dev",
            description: "Makes a new HTTP request",
            args: [
                {
                    type: "string",
                    key: "method",
                    prompt: "Which method to use? Type 'help' for more info."
                },{
                    type: "string",
                    key: "url",
                    prompt: "Which URL to make request on? If using help, enter anything."
                },{
                    type: "string",
                    key: "format",
                    prompt: "Format to use (JSON or TEXT)",
                    default: "text"
                }
            ]
        })
    }
    async run(msg, cmd) {
        this.msg = msg;
        this.cmd = cmd;
        this.command(cmd.method);
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
        got(this.cmd.url).then(res => {
            embed.setTitle("GET")
            embed.setDescription("Request results:");
            embed.addField("Response code", res.statusCode + " (Don't understand the code meaning? See `ice code " + res.statusCode + "`)");
            var headers = this.filter(res.headers, o => typeof o != "array");
            var head = "";
            var key = "";
            for (key in headers) {
                if(key == "set-cookie")continue;
                if (headers.hasOwnProperty(key)) {
                    head += key + ": '" + headers[key] + "'\n";
                }
            }

            embed.addField("Headers" + (head.length > 1016 ? " truncated": ""), "```\n" + head.substr(0,1016) + "```");
            if(res.headers["set-cookie"]){
                var cookies = res.headers["set-cookie"].join("\n");
                embed.addField("Cookies" + (cookies.length > 1016 ? " truncated": ""), "```\n" + cookies.substr(0,1016) + "```");
            }
            embed.addField("HTTP", "` HTTP/" + res.httpVersion + " GET `");
            if(res.body.length > 1016){
                embed.addField("Error", "Response body is longer than discord's limit. The body below is truncated to fit.");
                embed.addField("Response truncated", "```\n" + res.body.substr(0, 1016) + "\n```");
            } else {
                if(!this.cmd.format){
                    embed.addField("Response", "```\n" + res.body + "\n```");
                } else if (this.cmd.format.toLowerCase() == "json") {
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
            embed.setDescription(e.message);

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