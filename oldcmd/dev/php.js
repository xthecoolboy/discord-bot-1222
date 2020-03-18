const got = require("got");
const { parse } = require('node-html-parser');
const newEmbed = require("../../embed");

class PHP {
    getName() {
        return "php";
    }
    getDescription() {
        return "Shows PHP documentation. See `ice php bot::help`.";
    }
    exec(cmd, client, msg) {
        cmd.shift();
        this.cmd = cmd;
        this.client = client;
        this.msg = msg;

        var c = cmd[0];
        if(!c){
            return msg.channel.send("Nothing to find specified. See `ice php bot::help`");
        }
        if(c == "bot::help"){
            return this.help();
        }
        c = this.getURL(c);

        this.find(c);
    }
    help() {
        this.msg.channel.send("Use either `ice php <class | function>` or `ice php <class>::<method>`. Use object oriented style when available.");
    }
    getURL(c) {
        if(c.indexOf("::") != -1){
            return {
                original: c,
                type: "methodOrProperty",
                class: c.split("::")[0],
                methodOrProperty: c.split("::")[1],
                url: "https://www.php.net/manual/en/" + c.split("::")[0] + "." + c.split("::")[1] + ".php"
            };
        } else {
            return {
                original: c,
                type: "functionOrClass",
                functionOrClass: c,
                url2: "https://www.php.net/manual/en/class." + c,
                url: "https://www.php.net/manual/en/function." + c,
            };
        }
    }
    process(body, c) {
        const root = parse(body);
        var name = root.querySelector(".refname").text;
        var version = root.querySelector(".verinfo").text;
        var desc = root.querySelector(".dc-title").text;
        var code = root.querySelector(".fieldsynopsis");
        if (!code){
            code = root.querySelector(".dc-description").text.trim()
        } else {
            code = code.text.trim();
        }
        var embed = newEmbed();
        embed.setTitle(name);
        embed.setURL(c.url)
        embed.setDescription(desc);
        embed.addField("Version", version);
        if (code == code.substr(0, 1989)) {
            embed.addField("Syntax", "```php\n " + code.substr(0, 1989) + "\n```");
        } else {
            embed.addField("Error", "The code syntax is too long to fit. Click the title to open in browser.");
        }

        this.msg.channel.send(embed);
    }
    find(c) {
        got(c.url.replace(/_/g, "-")).then(res=>{
            this.process(res.body, c)
        }).catch(e=>{
            if(c.type == "functionOrClass"){
                got(c.url2.replace(/_/g, "-")).then(res => {
                    const root = parse(res.body);
                    var name = root.querySelector(".title").text;
                    var version = root.querySelector(".verinfo").text;
                    var desc = root.querySelector(".section .para").text;
                    var code = root.querySelector(".classsynopsis").text.trim();

                    var embed = newEmbed();
                    embed.setTitle(name);
                    embed.setURL(c.url)
                    embed.setDescription(desc);
                    embed.addField("Version", version);
                    if (code == code.substr(0, 1989)) {
                        embed.addField("Syntax", "```php\n " + code.substr(0, 1989) + "\n```");
                    } else {
                        embed.addField("Syntax", "The code syntax is too long to fit. Click the title to open in browser.");
                    }

                    this.msg.channel.send(embed);
                }).catch(e => {
                    this.msg.channel.send("Couldn't find " + c.original)
                });
            } else {
                this.msg.channel.send("Couldn't find " + c.original)
            }
        });
    }
}

module.exports = new PHP;