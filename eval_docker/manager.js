// Don't run me in deno! Won't work!
const {exec} = require("child_process");
const fs = require("fs");
const crypto = require('crypto')

module.exports = (code)=>{
    return new Promise((resolve, reject)=>{
        let hash = crypto.createHash('md5').update(code).digest("hex")
        
        if(code.startsWith("http://") || code.startsWith("https://")){
            file = `'${code.replace(/'/g, `'\\''`)}'`;
        } else {
            var file = __dirname + "/scripts/" + hash + ".js";
            
            fs.writeFileSync(file, code);
        }

        exec("docker image build -t eval_deno:1.0 " + __dirname, (err, sout, serr)=>{
            console.log(err);
            
            if(err)return reject(err);

            exec("docker container run --name eval_deno eval_deno:1.0 deno --allow-net " + file, (err, stdout, stderr)=>{
                if(err)return reject(err);
                resolve(stdout, stderr);
            })
        })
    })
}
