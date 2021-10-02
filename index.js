const {	Client,	Intents: {FLAGS}, Permissions } = require("discord.js");

const client = new Client({
	intents: [FLAGS.GUILDS, FLAGS.GUILD_MESSAGES, FLAGS.GUILD_MEMBERS, FLAGS.GUILD_PRESENCES]
  //intents: [Object.values(FLAGS)] // all intent => activate if problem with no event recived
  // Warning: make sure you have enabled all intents in the developer page of your bot !!!
});
require("dotenv").config();
const config = require("./config.json")


// moment config
const moment = require('moment-timezone');
moment().tz("Europe/Paris");
moment.locale("fr");


const sqlite = require("sqlite3")
let db = new sqlite.Database('./db.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE)


client.once("ready", () => {
  console.log("Logged as " + client.user.tag + "(" + client.user.id + ")")
  console.log("Starting prossec...")
  db.serialize(function(){
    db.run("CREATE TABLE IF NOT EXISTS `users` ( `user_id` TEXT NOT NULL , `status` TEXT NOT NULL , `lastseen` DATE NOT NULL , `connectAt` DATE NOT NULL , PRIMARY KEY (`id`))", (err, result) => {
      if(err) return console.error(err);
    })
    db.run("CREATE TABLE IF NOT EXISTS `channels` (`guild_id` TEXT NOT NULL, `channel_id` TEXT NOT NULL)")

  })


 // checkUser() // check une premiére fois au démarage
  setInterval(function () {
    checkUser() // check tout les 15 secondes 
    console.log("Checked.")
  }, 15 * 1000) 

})
// client.on("presenceUpdate", (oldPresence, newPresence) => {
//   if(newPresence.userId === "712374330322845718")return;
//   console.log(newPresence)
// })

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
    if (message.content === config.prefix + "stop") return message.reply("Pour arreter le bot, vous devez faire `s.stop confirm`\n:warning: Le seul moyen de redemarer le bot serra de depuis le panel ! :warning:")

    else if (message.content === config.prefix + "stop confirm") { // commande en cas de probléme
      await message.reply("Le bot va s'arreter.")
      await console.log("Une demmande d'arret a été demandé par " + message.author.tag + " à " + new moment())
      client.destroy();
    } else if (message.content === config.prefix + "verify") {
      checkUser()
    }else if (message.content === config.prefix + "test"){
      db.each("SELECT * FROM users" , (err, result) => {
        if(err)throw err;
        const member = message.guild.members.cache.get(result.user_id);
        console.log(member.id + member.displayName)
        message.reply("```\n" + member.presence.status + "\n```")
        
      })
    }
  }
})


require("./server.js")();
client.login(process.env.TOKEN)

async function checkUser() {
  db.each("SELECT * FROM users" , (err, result) => {  // recupérer tout les users a check dans la DB
    if(err)throw err;
      const guild = client.guilds.cache.get("694112715530305556")
      const member = guild.members.cache.get(result.user_id)
      
      if(!member.presence)return;
      if (member.presence.status === "idle" || member.presence.status === "online" || member.presence.status === "dnd") {
        let time = new Date().toISOString()
          if (result.status === "online") return; // verifie si le status du user n'est pas deja le méme que dans la DB
          else{
            db.run("UPDATE users SET status = 'online', connectAt = '" + time + "' WHERE user_id = '" +result.user_id + "'", (err) => {if(err)throw err}); // set dans la DB la date et l'heure de connection du user
            sendToAllChannelEmbed(member.user.tag, member.user.displayAvatarURL({
                  dynamic: true
                }), member.user.tag + " s'est connecté !", "À: " + moment(time).format("HH[h]mm [et] SS [secondes le ] Do MMMM YYYY") + "\nDéconnecté pendant: " + moment(result.lastseen).fromNow(true), "12B533")
              console.log("on")
          }
      } else if (member.presence.status === "offline") {
        let time = new Date().toISOString()
  
          if (result.status === "offline") return; // verifie si le status du user n'est pas deja le méme que dans la DB
          else {
            console.log('off')

            db.run("UPDATE users SET status = 'offline', lastseen = '" + time + "' WHERE user_id = '" +result.user_id + "'", (err) => {if(err)throw err});
                sendToAllChannelEmbed(member.user.tag, member.user.displayAvatarURL({
                  dynamic: true
                }), member.user.tag + " s'est déconecté !", "À: " + moment(time).format("HH[h]mm [et] SS [secondes le ] Do MMMM YYYY") + "\nConnecté pendant :" + moment(result.connectAt).fromNow(true))
                // moment(result.connectAt).format("DD [jours,] hh [heures,] mm [minutes et ] ss [secondes]"))
          }
      }
  })
  
}


async function sendToAllChannelEmbed(authorName, authorAvatarUrl, title, description, color) {
 	db.each("SELECT * FROM `channels`",(err, result) => { // get tout les channels où il faut envoyer l'alertes
    if(err)return console.error(err)
      const channel = client.channels.cache.get(result.channel_id);
      channel.send({embeds: [{
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


