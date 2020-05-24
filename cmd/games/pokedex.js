var Pokedex = require("pokedex-promise-v2");
var P = new Pokedex();
const newEmbed = require("../../embed");
const commando = require("@iceprod/discord.js-commando");

module.exports = class Poke extends commando.Command {
    constructor(client) {
        super(client, {
            name: "poke",
            memberName: "poke",
            group: "games",
            hidden: true,
            description: "Finds something in pokedex",
            usage: "poke help",
            args: [
                {
                    type: "string",
                    key: "cmd",
                    prompt: "Which subcommand to use? Use help to see available ones."
                },
                {
                    type: "string",
                    key: "poke",
                    prompt: "Pokemon to see",
                    default: ""
                }
            ]
        });
    }

    async run(msg, cmd) {
        this.cmd = cmd;
        this.msg = msg;
        this.processCommand(cmd);
    }

    processCommand(cmd) {
        switch(cmd.cmd) {
            case "mon":
                this.mon();
                break;
            case "help":
                this.help();
                break;
            default:
                this.msg.channel.send("Unknown subcommand. See `poke help`");
        }
    }

    async mon() {
        if(!this.cmd.poke) {
            this.msg.channel.send("No pokemon to find specified. Usage: `poke mon <name>`");
            return;
        }
        try {
            var pokemon = await P.getPokemonByName(this.cmd.poke.toLowerCase());
        } catch(e) {
            this.msg.channel.send("Error occured during searching for the pokemon '" + this.cmd.poke + "'");
            return;
        }
        if(!pokemon) {
            this.msg.channel.send("No pokemon found. Double check the name '" + this.cmd.poke + "'");
            return;
        }

        var p = pokemon;// LAZINESS
        var embed = newEmbed();
        embed.setTitle(p.name);
        embed.addField("Type", p.types[0].type.name);
        embed.addField("Weight", p.weight);
        embed.addField("Height", p.height);

        this.msg.channel.send(embed);
    }

    help() {
        this.msg.channel.send("The only currently working sub command is 'mon' which gets information about given pokemon.");
    }
};
