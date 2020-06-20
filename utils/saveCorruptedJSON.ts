import { Client } from "https://deno.land/x/mysql/mod.ts";
import { config } from 'https://deno.land/x/dotenv/mod.ts';

const c = config();

const client = await new Client().connect({
    hostname: c["HOSTNAME"] || "127.0.0.1",
    username: c["USERNAME"] || "root",
    db: c["DATABASE"] || "ice",
    password: c["PASSWORD"] || "",
});

console.log("Fetching");
var length = await client.query("SELECT count(*) as c FROM guilds WHERE data LIKE \"%\\%%\"");
const l = length[0].c;

console.log("Found " + l + " candidates");

var i = 0;

while(i < l) {
    console.log(i, "Fetching " + i);
    const f = await Deno.open("output/" + i+ ".json", {
        create: true,
        write: true,
        truncate: true
    });
    const p = Deno.run({
        cmd: ["mysql", "-N", "-B", "-D", client.config.db + "", "-h", client.config.hostname + "", "-u", client.config.username + "", "-p" + client.config.password + "", "-e", "SELECT data FROM guilds WHERE data LIKE \"%\\%%\" LIMIT " + i + ",1"],
        stdout: f.rid
    });
    i++;
    var s = await p.status();
    console.log(i, s.success ? "Saved sucessfuly" : "Saving failed");
}

await client.close();
