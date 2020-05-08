#!/usr/bin/env deno

import { Channel, Client } from "./lib/main.ts";


var client = await Client.newClient("692837502117216307", "654725534365909043");

var channel = new Channel({
    client,
    id: "692839951611723877"
});

console.log("Sending test message");
var msg = await channel.send("Hello world from actions!");
console.log("Done!");
