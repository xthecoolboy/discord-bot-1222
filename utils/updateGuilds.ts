
for await(var file of Deno.readDir("./output")) {
    if(file.name.split(".")[1] !== "json") continue;
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const data = encoder.encode("UPDATE guilds SET data='" + decoder.decode(Deno.readFileSync("./output/" + file.name)) + "' WHERE snowflake=-1");
    await Deno.writeFile("./output/" + file.name.split(".")[0] + ".sql", data);
}
