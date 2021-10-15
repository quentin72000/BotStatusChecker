const client = require("../index");

client.on("ready", () =>{
    console.log(`${client.user.tag} is up and ready to go!`)
    client.channels.cache.get("799769617866162208").send("Launched")
    require("../verify.js")
});
