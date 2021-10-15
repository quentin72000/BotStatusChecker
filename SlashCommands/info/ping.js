const { Client, CommandInteraction } = require("discord.js");
const moment = require("moment");
require("moment-duration-format")
module.exports = {
    name: "ping",
    description: "Return latency of the bot and discord.",
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        //await interaction.deferReply(); // aleready defered in the top of the event
        
        const uptime = moment.duration(client.uptime).format(" D [jours(s)], H [heure(s)], m [minute(s)], s [seconde(s)]");
        let pingEmbed = {
            title: "Ping et Uptime",
            description: `**Uptime** : ${uptime}\n**Latence du bot** : ${interaction.createdTimestamp - Date.now()}ms\n**Latence API discord** : ${client.ws.ping}ms`,
            color: "#0099ff"
        }
        await interaction.editReply({
            embeds: [pingEmbed]
        });
    }
};