const {Client, CommandInteraction, Permissions: { FLAGS }} = require("discord.js");
module.exports = {
    name: "setchannel",
    description: "Define the channel where alerts will be sent.",
    type: 'CHAT_INPUT',
    options: [{
        name: "salon",
        type: "CHANNEL",
        description: "Channel where alerts will be sent.",
        required: true
    }],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        let errorEmbed = {
            title: 'An error occurred',
            color: 'FF0000',
        }

        if (!interaction.member.permissions.has(FLAGS.ADMINISTRATOR)) {
            errorEmbed.description = "You're not administrator.";
            return await interaction.editReply({
                embeds: [errorEmbed]
            })
        }

        const choosedChannel = client.channels.cache.get(args[0])
        if (choosedChannel.type === "GUILD_TEXT") {
            await client.db.get("SELECT * FROM guilds WHERE guild_id=" + interaction.guildId, async (err, result) => { // verif si la guild n'a pas dèja un salon de set
                if (err) {
                    console.log("Error while inserting channel into the database")
                    console.error(err)
                    return await interaction.editReply("Error: An error occurred while inserting channel into the database. \nPlease try again or contact the owner.")
                } else if (result) {
                    await client.db.run("UPDATE guilds SET channel_id=" + choosedChannel.id + " WHERE guild_id="+ interaction.guildId, async (err) => {
                        if (err) {
                            console.log("Error while updating channel into the database")
                            console.error(err)
                            errorEmbed.description = "Error: An error occurred while updating channel into the database. \nPlease try again or contact the owner."
                            return await interaction.editReply({
                                embeds: [errorEmbed]
                            })
                        }
                        else{
                            interaction.editReply("Successfully uptadated channel in the database.")
                        }
                    })
                } else {
                    await client.db.run("INSERT INTO guilds (guild_id, channel_id) VALUES (" + choosedChannel.guildId + "," + interaction.id + ")", async (err) => {
                        if (err) {
                            console.log("Error while inserting channel into the database")
                            console.error(err)
                            errorEmbed.description = "Error: An error occurred while inserting channel into the database. Please try again or contact the owner."
                            return await interaction.editReply({
                                embeds: [errorEmbed]
                            })
                        }
                        interaction.editReply("Successfully added channel to the database.")
                    })
                }
            })


        } else {
            errorEmbed.description = "Error: please choose only an TEXT channel !"
            await interaction.editReply({
                embeds: [errorEmbed]
            });
        }

    }
};