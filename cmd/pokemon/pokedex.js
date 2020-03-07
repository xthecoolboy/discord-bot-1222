var Pokedex = require('pokedex-promise-v2');
var P = new Pokedex();
const newEmbed = require("../../embed");

class Poke {
    disabled = true;
    getName(){
        return "poke";
    }
    getDescription(){
        return "Finds something in pokedex";
    }
    exec(cmd, client, msg){
        cmd.shift();
        console.log(cmd);
        this.cmd = cmd;
        this.client = client;
        this.msg = msg;
        if(!cmd[0]){
            msg.channel.send("Please specify a subcommand. See `ice poke help`");
            return;
        }
        this.processCommand(cmd);
    }
    processCommand(cmd){
        switch(cmd[0]){
            case "mon":
                this.mon();
                break;
            case "help":
                this.help();
                break;
            default:
                this.msg.channel.send("Unknown subcommand. See `ice help poke`");
        }
    }
    async mon(){
        if(!this.cmd[1]){
            this.msg.channel.send("No pokemon to find specified. Usage: `ice poke mon <name>`");
            return;
        }
        try {
            var pokemon = await P.getPokemonByName(this.cmd[1]);
        } catch(e){
            console.warn(e);
            this.msg.channel.send("Error occured during searching for the pokemon '" + this.cmd[1] + "'");
            return;
        }
        if(!pokemon){
            this.msg.channel.send("No pokemon found. Double check the name '" + this.cmd[1] + "'");
            return;
        }
        
        var p = pokemon;//LAZINESS
        var embed = newEmbed();
        embed.setTitle(p.name);
        embed.addField("Type", p.types[0].type.name);
        embed.addField("Weight", p.weight);
        embed.addField("Height", p.height);

        this.msg.channel.send(embed);
    }
    help(){
        this.msg.channel.send("In development");
    }
}

module.exports = new Poke;