const {	Client,	Intents, Collection, Permissions } = require("discord.js");
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS]
  //intents: [Object.values(Intents.FLAGS)] // all intent => activate if problem with no event recived
});
require("dotenv").config();
const config = require("./config.json")


// moment config
var moment = require('moment-timezone');
moment().tz("Europe/Paris");
moment.locale("fr");


const {getConnection} = require("./db/db.js")


client.once("ready", () => {
  console.log("Logged as " + client.user.tag + "(" + client.user.id + ")")
  console.log("Starting prossec...")
  getConnection().connect(function(err) { // se connecte a la db et envoie une erreur si la connection a échoué
    if (err) throw err;
    console.log("Connecté à la base de données MySQL!");
  });


 // checkUser() // check une premiére fois au démarage
  setInterval(function () {
    checkUser() // check tout les 15 secondes
    console.log("Checked.")
  }, 15 * 1000) 

})
client.on("presenceUpdate", (oldPresence, newPresence) => {
  //console.log(newPresence)
})

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
      getConnection().query("SELECT * FROM users" , (err, result) => {
        if(err)throw err;
        const member = message.guild.members.cache.get(result[0].user_id);
        message.reply("```\n" + member.presence.status + "\n```")
        console.log(member.presence.status)
      })
    }
  }
})


require("./server.js")();
client.login(process.env.TOKEN)

async function checkUser() {
  getConnection().query("SELECT * FROM users" , (err, result) => {  // recupérer tout les users a check dans la DB
    if(err)throw err;
    result.forEach(async(userR) => {
      const guild = client.guilds.cache.get("694112715530305556")
      const member = guild.members.cache.get(userR.user_id)
      
      if(!member.presence)return;
      if (member.presence.status === "idle" || member.presence.status === "online" || member.presence.status === "dnd") {
        let time = new Date().toISOString()
          if (userR.status === "online") return; // verifie si le status du user n'est pas deja le méme que dans la DB
          else{
            getConnection().query("UPDATE users SET status = 'online', connectedAt = '" + time + "' WHERE user_id = '" +userR.user_id + "'", (err) => {if(err)throw err}); // set dans la DB la date et l'heure de connection du user
            sendToAllChannelEmbed(member.user.tag, member.user.displayAvatarURL({
                  dynamic: true
                }), member.user.tag + " c'est connecté !", "À: " + moment(time).format("HH[h]mm [et] SS [secondes le ] Do MMMM YYYY") + "\nDéconnecté pendant: " + moment(userR.lastseen).fromNow(true), "12B533")
              console.log("on")
          }
      } else if (member.presence.status === "offline") {
        let time = new Date().toISOString()
  
          if (userR.status === "offline") return; // verifie si le status du user n'est pas deja le méme que dans la DB
          else {
            console.log('off')

            getConnection().query("UPDATE users SET status = 'offline', lastseen = '" + time + "' WHERE user_id = '" +userR.user_id + "'", (err) => {if(err)throw err});
                sendToAllChannelEmbed(member.user.tag, member.user.displayAvatarURL({
                  dynamic: true
                }), member.user.tag + " c'est déconecté !", "À: " + moment(time).format("HH[h]mm [et] SS [secondes le ] Do MMMM YYYY") + "\nConnecté pendant :" + moment(userR.connectedAt).fromNow(true))
          }
      }
    });

  })
  
}


async function sendToAllChannelEmbed(authorName, authorAvatarUrl, title, description, color) {
 	getConnection().query("SELECT * FROM `channels`",(err, result) => { // get tout les channels où il faut envoyer l'alertes
    if(err)return console.error(err)
    result.forEach(value => {
      const channel = client.channels.cache.get(value.channel_id);
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
  })
}


