

class Sudo {
    getName(){
        return "sudo";
    }
    getDescription(){
        return "The SUDO command";
    }
    exec(cmd, client, msg){
        cmd.shift();
        this.msg = msg;
        this.cmd = cmd;
        var guild = client.guilds.get("655467856594599946");
        if(guild){
            var isMember = (guild.members.get(msg.author.id));
        } else {
            isMember = false;
        }

        if (!isMember) {
            msg.channel.send("```\nYou are not part of the sudoers file. This incident will be reported.\n```");
            return;
        }
        var command = cmd[0] || "";
        command = command.toLowerCase();
        this.command(command);
    }

    command(cmd) {
        switch (cmd) {
            case "-h":
                this.showHelp();
                break;
            case "--help":
                this.showHelp();
                break;
            case "-g":
            case "--get":
                this.get();
                break;
            default:
                this.msg.channel.send("```\nNo command specified. See 'sudo -h' for man help page.\n```");
        }
    }
    get(){
        require("./get.js").get(this.cmd, this.client, this.msg);
    }

    showHelp(){
        this.msg.channel.send(`\`\`\`
Sudo

-h, --help => shows this help page.
-g, --get => gets a specific resource.
\`\`\``);
    }
}
module.exports = new Sudo;