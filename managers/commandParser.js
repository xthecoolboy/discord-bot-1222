module.exports = (message)=>{
    var cmd = [];
    var pointer = 0;
    var inQuotes = 0;
    for (var i = 0; i < message.length; i++) {
        var char = message.charAt(i);
        //console.log("[PARSE] p:" + pointer + " q:" + inQuotes + " cmd: " + cmd);
        if (char == '"' && inQuotes != 2) {
            (inQuotes == 1 ? inQuotes == 0 : inQuotes == 1);
            continue;
        } if (char == "'" && inQuotes != 1) {
            (inQuotes == 2 ? inQuotes == 0 : inQuotes == 2);
            continue;
        }
        if(char == " "){
            pointer++;
            continue;
        }
        if(cmd[pointer] != undefined){
            cmd[pointer] += char;
        } else {
            cmd[pointer] = char;
        }
    }
    return cmd;
}