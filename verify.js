const client = require("./index.js")

const moment = require('moment');

// DB setup
const sqlite = require("sqlite3")
let db = new sqlite.Database('./db.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE)

client.db = db


console.log("Logged as " + client.user.tag + "(" + client.user.id + ")")
console.log("Starting prossec...")
db.serialize(function () {
  db.run("CREATE TABLE IF NOT EXISTS `users` ( `user_id` TEXT NOT NULL , `status` TEXT NOT NULL , `lastseen` DATE NOT NULL , `connectAt` DATE NOT NULL , PRIMARY KEY (`id`))", (err, result) => {
    if (err) return console.error(err);
  })
  db.run("CREATE TABLE IF NOT EXISTS `channels` (`guild_id` TEXT NOT NULL, `channel_id` TEXT NOT NULL)")

})

setInterval(async function () {
  await checkUser() // check every 15 seconds
  console.log("Checked.")
}, client.config.interval_check_in_second * 1000)

async function checkUser() {
  db.each("SELECT * FROM users", (err, result) => { // get all users to check in the DB
    if (err) throw err;
    const guild = client.guilds.cache.get("694112715530305556")
    const member = guild.members.cache.get(result.user_id)

    if (!member.presence) return;
    if (member.presence.status === "idle" || member.presence.status === "online" || member.presence.status === "dnd") {
      let time = moment()
      if (result.status === "online") return; // check if the status of the user is not same in the DB
      else {
        db.run("UPDATE users SET status = 'online', connectAt = '" + time + "' WHERE user_id = '" + result.user_id + "'", (err) => {
          if (err) throw err
        }); // set in the DB the date in time of the connection of the user
        sendToAllChannelEmbed(result.user_id, member.user.tag, member.user.displayAvatarURL({
          dynamic: true
        }), member.user.tag + " has been connected !", "At: " + moment(time).format("HH[h]mm [and] SS [seconds the ] Do MMMM YYYY") + "\nDisconnected during: " + moment(result.lastseen).fromNow(true), "12B533")
        console.log("on")
      }
    } else if (member.presence.status === "offline") {
      let time = moment()

      if (result.status === "offline") return; // check if the status of the user is not same in the DB
      else {
        console.log('off')
        db.run("UPDATE users SET status = 'offline', lastseen = '" + time + "' WHERE user_id = '" + result.user_id + "'", (err) => {
          if (err) throw err
        });
        sendToAllChannelEmbed(result.user_id, member.user.tag, member.user.displayAvatarURL({
          dynamic: true
        }), member.user.tag + " has been disconnected. !", "At: " + moment(time).format("HH[h]mm [and] SS [seconds the ] Do MMMM YYYY") + "\nConnected during :" + moment(result.connectAt).fromNow(true))
        // moment(result.connectAt).format("DD [jours,] hh [heures,] mm [minutes et ] ss [secondes]"))
      }
    }
  })

}

async function sendToAllChannelEmbed(user_id, authorName, authorAvatarUrl, title, description, color) {
  db.each("SELECT * FROM `channels`", (err, result) => { // get all channels where need to send alerts
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