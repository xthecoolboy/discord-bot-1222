const Discord = require('discord.js');
const newEmbed = require("../../embed");
const inspect = require("util").inspect;
const { NodeVM } = require('vm2');
const tick = ":white_check_mark:";
const cross = ":x:";
const cluster = require('cluster');

if (cluster.isMaster) {

    class LogMe {
        getName() {
            return "eval";
        }
        getDesc() {
            return "Runs the given JS code";
        }
        /**
         * 
         * @param {Array} cmd 
         * @param {Discord.Client} client 
         * @param {Discord.Message} msg 
         */
        exec(cmd, client, msg) {
            var embed = newEmbed();
            
            const fn = cluster.fork();
            var timeout = null;
            var done = false;
            fn.on("message", (message)=>{
                if(!message._ready){
                    if(message.type == "ok"){
                        msg.channel.sendEmbed(message.embed);
                    } else {
                        msg.channel.send("An error occured during evaluation");
                    }
                    done = true;
                    clearTimeout(timeout);
                } else {
                    fn.send({
                        cmd,
                        msg: msg.content
                    })
                    timeout = setTimeout(_ => {
                        try {
                            if(!done){
                                fn.process.kill();
                                console.log("Killed long taking process");
                                msg.channel.send("The code provided took too long");
                            }
                        } catch(e){
                            
                        }
                    }, 10000);
                }
            })
        }
    }

    module.exports = new LogMe;
} else {
    console.log('Worker started');
    
    process.send({_ready: true});

    process.on('message', message => {
        var cmd = message.cmd;
        var msg = message.msg;
        var command = msg.substr(msg.indexOf(cmd[0]) + cmd[0].length);
        var embed = newEmbed();
        const vm = new NodeVM({
            timeout: 1000,
            sandbox: {},
            console: "redirect"
        });
        var consoleOutput = "";

        function addConsole(args) {
            consoleOutput += inspect(args) + "\n";
        }

        vm.on("console.debug", addConsole);
        vm.on("console.log", addConsole);
        vm.on("console.info", addConsole);
        vm.on("console.warn", addConsole);
        vm.on("console.error", addConsole);
        try {
            console.log("Evaluating " + command);
            var output = vm.run(command);
            console.log(output);
            embed.setTitle(tick + " Eval");
            embed.addField("Command", "```js\n" + command + "\n```");
            try {
                embed.addField("Output", "```\n" + JSON.stringify(output, null, 2) + "\n```");
            } catch (e){
                console.warn("Error occured during JSON.stringify");
            }
            embed.addField("Console", "```\n" + consoleOutput + "\n```");
            process.send({
                type: "ok",
                embed
            });
        } catch (e) {
            embed.setTitle(cross + " Eval");
            embed.addField("Error", e);
            console.log(e);
            process.send({
                type: "error",
                error: e
            });
        }
        process.exit(0);
    });
}
