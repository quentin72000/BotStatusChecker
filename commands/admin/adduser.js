const { Message, Client } = require("discord.js");
module.exports = {
    name: "adduser",
    aliases: ['addu', "au"],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        if(!client.config.whitelistUsers.includes(message.author.id))return message.reply("Error: You can't do that.");
        client.db.run("INSERT INTO users (user_id) VALUES("+ args[0]+ ")")
		message.reply("added")
    },
};
