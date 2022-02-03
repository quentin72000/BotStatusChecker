const { Message, Client } = require("discord.js");
module.exports = {
    name: "check",
    aliases: ['verify', "ch"],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        if(!client.config.whitelistUsers.includes(message.author.id))return message.reply("Error: You can't do that.");
        require("../../verify.js");
        message.reply("Checked !")
    },
};
