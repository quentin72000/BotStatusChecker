const {	Client,	Intents} = require("discord.js");
const client = new Client({intents: Object.values(Intents.FLAGS)})
const config = require("./config.json")


client.on('messageCreate', (message) => {
	
	message.reply({embeds: [{title: "Hello"}]})
});


client.once("ready", () => {
	console.log("ready " + client.user.tag)
	client.user.setActivity("On")
})



client.login(process.env.TOKEN)