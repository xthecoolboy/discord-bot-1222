// Don't run me in deno! Won't work!
const {exec} = require("child_process");
const fs = require("fs");
const crypto = require('crypto')

module.exports = (code)=>{
    return new Promise((resolve, reject)=>{
        let hash = crypto.createHash('md5').update(code).digest("hex")
        
        if(code.startsWith("http://") || code.startsWith("https://")){
            file = `'${code.replace(/'/g, `'\\''`)}'`;

            exec("docker container run --name eval_deno eval_deno:1.0 deno --allow-net " + file, (err, stdout, stderr)=>{
                if(err)return reject(err);
                resolve({stdout, stderr});
            });
            return;
        } else {
            var file = __dirname + "/scripts/" + hash + ".js";
            
            fs.writeFileSync(file, code);
            
            var fileLoc = "";
            exec("docker container cp \"" + __dirname + "/scripts\" eval_deno:./scripts", (err, sout, serr)=>{
                console.log(err);
                
                if(err)return reject(err);
                
                exec("docker container run --name eval_deno eval_deno:1.0 /root/.local/bin/deno --allow-net " + fileLoc, (err, stdout, stderr)=>{
                    if(err)return reject(err);
                    resolve({stdout, stderr});
                })
            })
        }
    })
}
