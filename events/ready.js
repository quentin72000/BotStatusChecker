const client = require("../index");

client.on("ready", () =>{
    console.log(`${client.user.tag}(${client.user.id}) is up and ready to go!`)
    require("../verify.js")
});
