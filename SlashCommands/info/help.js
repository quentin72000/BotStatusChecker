const { Client, CommandInteraction } = require("discord.js");
module.exports = {
    name: "help",
    description: "Send information about the bot.",
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        //await interaction.deferReply(); // aleready defered in the top of the event
        let pingEmbed = {
            title: "Help",
            description: "BotStatusChecker is a bot that send alerts in a defined channel when slected bots are down.\n\nBotStatusChecker is an open source project developed by quentin72000\n\nSource Code: [github.com/quentin72000/BotStatusChecker](https://github.com/quentin72000/BotStatusChecker)\nInvite:[Click here](https://discord.com/api/oauth2/authorize?client_id=867653161036152832&permissions=8&scope=applications.commands%20bot)",
            color: "#0099ff"
        }
        await interaction.editReply({
            embeds: [pingEmbed]
        });
    }
};