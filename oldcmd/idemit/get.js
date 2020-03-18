
class Get {
    get(cmd, client, msg){
        this.cmd = cmd;
        this.client = client;
        this.msg = msg;

        switch(cmd[1]){
            case "idemitFolder":
            case "shared":
                msg.channel.send("Shared folder available at http://go-dan.tk/idemitFolder");
                break;
        }
    }
}

module.exports = new Get;