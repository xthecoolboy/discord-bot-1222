const got = require("got");
const { parse } = require("node-html-parser");
const newEmbed = require("../../embed");
const commando = require("@iceprod/discord.js-commando");

module.exports = class PHP extends commando.Command {
    constructor(client) {
        super(client, {
            name: "php",
            memberName: "php",
            group: "dev",
            description: "Shows information from PHP documentation. Use either `ice php <class | function>` or `ice php <class>::<method>`. Use object oriented style when available.",
            usage: "php help",
            args: [
                {
                    type: "string",
                    key: "php",
                    prompt: "Which class/function to get info about?"
                }
            ]
        });
    }

    async run(msg, cmd) {
        this.lang = await msg.guild.lang();
        this.cmd = cmd;
        this.msg = msg;

        var c = cmd.php;
        if(c === "help") {
            return await this.help();
        }
        if(c.startsWith("mysqli_")) {
            c = c.replace("mysqli_", "mysqli::");
        }

        c = this.getURL(c);

        this.find(c);
    }

    async help() {
        this.msg.channel.send(this.lang.php.help.replace(/%s/g, await this.msg.guild.settings.get("prefix", "aztec ")));
    }

    getURL(c) {
        if(c.indexOf("::") !== -1) {
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
                url: "https://www.php.net/manual/en/function." + c
            };
        }
    }

    process(body, c) {
        const root = parse(body);
        var name = root.querySelector(".refname").text;
        var version = root.querySelector(".verinfo").text;
        var desc = root.querySelector(".dc-title").text;
        var code = root.querySelector(".fieldsynopsis");
        if(!code) {
            code = root.querySelector(".dc-description").text.trim();
        } else {
            code = code.text.trim();
        }
        this.sendEmbed({
            name,
            version,
            desc,
            code,
            url: c.url
        });
    }

    sendEmbed({ name, version, desc, code, url }) {
        var embed = newEmbed();
        embed.setTitle(name);
        embed.setDescription(desc);
        embed.setURL(url);
        embed.addField(this.lang.php.version, version);
        if(code === code.substr(0, 1989)) {
            embed.addField(this.lang.php.syntax, "```php\n " + code.substr(0, 1989) + "\n```");
        } else {
            embed.addField(this.lang.php.error, this.lang.php.long);
        }

        this.msg.channel.send(embed);
    }

    find(c) {
        got(c.url.replace(/_/g, "-")).then(res => {
            this.process(res.body, c);
        }).catch(e => {
            if(c.type === "functionOrClass") {
                got(c.url2.replace(/_/g, "-")).then(res => {
                    const root = parse(res.body);
                    var name = root.querySelector(".title").text;
                    var version = root.querySelector(".verinfo").text;
                    var desc = root.querySelector(".section .para").text;
                    var code = root.querySelector(".classsynopsis").text.trim();

                    this.sendEmbed({
                        name,
                        version,
                        desc,
                        code,
                        url: c.url
                    });
                }).catch(e => {
                    this.msg.channel.send(this.lang.php.not_found.replace("%s", c.original));
                });
            } else {
                this.msg.channel.send(this.lang.php.not_found.replace("%s", c.original));
            }
        });
    }
};
