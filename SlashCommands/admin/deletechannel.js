const { Client, CommandInteraction, Permissions: {FLAGS} } = require("discord.js");
module.exports = {
    name: "deltechannel",
    description: "Delete channels where alerts are send.",
    type: 'CHAT_INPUT',
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        let errorEmbed = {
            title: 'An error occurred',
            color: 'FF0000',
        }

        if(!interaction.member.permissions.has(FLAGS.ADMINISTRATOR)){errorEmbed.description = "You're not administrator."; return await interaction.editReply({embeds: [errorEmbed]})}


		client.db.get("SELECT * FROM channels WHERE guild_id=" + interaction.guildId, async(err, result) =>{ // verif que la guild à bien dèja set un channel
			if(err){
				console.log("An error occurred while fetching data in the database")
				console.error(err)
				return await interaction.editReply("Error: An error occurred while fetching data in the database. Please try again or contact the owner.")
			}else if(!result){
				return await interaction.editReply({content: "Error: You don't have channels in the database.", ephemeral: true});
			}else {
				client.db.run("DELETE FROM channels WHERE guild_id="+interaction.guildId, async(err) => {
					if(err){
						console.log("An error occurred while fetching data in the database")
						console.error(err)
						return awaitinteraction.editReply("Error: An error occurred while deleting data in the database. Please try again or contact the owner.")
					}
					await interaction.editReply("Succefully deleted the channel from the database.")
				})
			}
		})
		

	}
}