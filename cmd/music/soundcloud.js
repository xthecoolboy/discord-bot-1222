

class Music {
    getName() {
        return "music";
    }
    getDescription() {
        return "Music commands. See `ice music help`.";
    }
    exec(cmd, client, msg) {
        this.cmd = cmd;
        this.client = client;
        this.msg = msg;
        cmd.shift();

        if(!cmd[0]){
            return msg.channel.send("No subcommand specified. See `ice music help`.");
        }

        this.process(cmd[0]);
    }
    process(cmd){
        switch(cmd){
            case "help":
                this.help();
                break;
            case "setchannel":
                this.setChannel();
                break;
            default:
                this.msg.channel.send("Command " + cmd + " not found. All commands are lowercase. See `ice music help`.");
        }
    }
    setChannel(){
        this.msg.channel.send("To do");
    }
    help(){
        this.msg.channel.send("In development");
    }
}

module.exports = new Music;