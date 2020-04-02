const inspect = require("util").inspect;
const newEmbed = require("../../../embed");
const{
    parentPort, workerData, isMainThread
} = require("worker_threads");

if(!isMainThread || workerData) {
    const{
        NodeVM
    } = require("vm2");
    const tick = ":white_check_mark:";
    const cross = ":x:";

    console.log("Worker started");

    var command = workerData;
    var embed = newEmbed();
    const vm = new NodeVM({
        timeout: 1000,
        sandbox: {},
        console: "redirect"
    });
    var consoleOutput = "";

    /* eslint-disable no-inner-declarations */
    function addConsole(args) {
        consoleOutput += inspect(args) + "\n";
    }
    /* eslint-enable no-inner-declarations */

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
        } catch(e) {
            console.warn("Error occured during JSON.stringify");
        }
        embed.addField("Console", "```\n" + consoleOutput + "\n```");
        parentPort.postMessage({
            type: "ok",
            embed
        });
    } catch(e) {
        embed.setTitle(cross + " Eval");
        embed.addField("Error", e);
        console.log(e);
        parentPort.postMessage({
            type: "error",
            error: e
        });
    }
    process.exit(0);
}
