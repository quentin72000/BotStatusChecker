const client = require("./index.js")
const moment = require('moment');


console.log("Starting prossec...")


setInterval(async function () {
  await checkUser() // check every 15 seconds
  console.log("Checked.")
}, client.config.interval_check_in_second * 1000)

async function checkUser() {
  client.db.each("SELECT * FROM users", async(err, result) => { // get all users to check in the client.db
    if (err) throw err;
    const guild = await client.guilds.cache.get(client.config.bot_server)
    const member = await guild.members.cache.get(result.user_id)
    if (!member)throw new Error("The member of user " + result.user_id + " can't be reach. Stopping...");
    if (!member.presence)throw new Error("The presence of user " + result.user_id + " can't be reach. Stopping...");
    if (member.presence.status === "idle" || member.presence.status === "online" || member.presence.status === "dnd") {
      let time = moment()
      if (result.status === "online") return; // check if the status of the user is not same in the client.db
      else {
        client.db.run("UPDATE users SET status = 'online', connectAt = '" + time + "' WHERE user_id = '" + result.user_id + "'", (err) => {
          if (err) throw err
        }); // set in the client.db the date in time of the connection of the user
        sendToAllChannelEmbed(result.user_id, member.user.tag, member.user.displayAvatarURL({
          dynamic: true
        }), member.user.tag + " has been connected !", "At: " + moment(time).format("HH[h]mm [and] SS [seconds the ] Do MMMM YYYY") + "\nDisconnected during: " + moment(result.lastseen).fromNow(true), "12B533")
        console.log("on")
      }
    } else if (member.presence.status === "offline") {
      let time = moment()

      if (result.status === "offline") return; // check if the status of the user is not same in the client.db
      else {
        console.log('off')
        client.db.run("UPDATE users SET status = 'offline', lastseen = '" + time + "' WHERE user_id = '" + result.user_id + "'", (err) => {
          if (err) throw err
        });
        sendToAllChannelEmbed(result.user_id, member.user.tag, member.user.displayAvatarURL({
          dynamic: true
        }), member.user.tag + " has been disconnected !", "At: " + moment(time).format("HH[h]mm [and] SS [seconds the ] Do MMMM YYYY") + "\nConnected during :" + moment(result.connectAt).fromNow(true))
      }
    }
  })

}

async function sendToAllChannelEmbed(user_id, authorName, authorAvatarUrl, title, description, color) {
  client.db.each("SELECT * FROM `guilds`", (err, result) => { // get all channels where need to send alerts
    if (err) return console.error(err)
    const channel = client.channels.cache.get(result.channel_id);
    channel.send({
      embeds: [{
        author: {
          name: authorName,
          icon_url: authorAvatarUrl,
        },
        title: title,
        color: color,
        description: description
      }]
    })
  })
}