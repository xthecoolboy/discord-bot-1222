
for(var file of Deno.args) {
    if(file.split(".")[file.split(".").length - 1] !== "json") {
        console.log("Skipping non-json file");
        continue;
    }
    console.log("Formatting " + file);
    const decoder = new TextDecoder("utf-8");
    const encoder = new TextEncoder();
    const data = await Deno.readFile(file);
    const text = JSON.parse(decoder.decode(data));
    Deno.writeFileSync(file, encoder.encode(JSON.stringify(text, null, 2)));
    console.log("Formatted " + file);
}

console.log("Done");
