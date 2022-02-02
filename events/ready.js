const client = require("../index");

client.on("ready", async () => {
    await get_cache()
    console.log(`${client.user.tag}(${client.user.id}) is up and ready to go!`)
    require("../verify.js")

});


async function get_cache() {
    try {
        let channels_count = 0;
        let members_count = 0;
        const guild = await client.guilds.fetch(client.config.bot_server)
        await client.db.each("SELECT * FROM users", async (err, result) => { // get all users to check in the client.db to add it to the bot cache
            const member = await guild.members.fetch(result.user_id)
            if(member.displayName)members_count++;
            // console.log(member.displayName, members_count)
        });

        await client.db.each("SELECT * FROM `guilds`", async (err, result) => { // get all channels where need to send alerts in the db to add it to the bot cache
            const channel = await guild.channels.fetch(result.channel_id);
            if(channel.name)channels_count++;
            // console.log(channel.name, channels_count)
        });
        setTimeout(function log (){console.log(`Succefulley loaded ${members_count} to check members and ${channels_count} alerts channels.`)}, 1000)
    } catch (error) {
        console.error("An error occured while caching all user and channels. Please check if users and channels are present on your server.")
        console.error(error)
    }


}