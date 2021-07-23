const Discord = require("discord.js");
const client = new Discord.Client;
var moment = require('moment-timezone');
const config = require("./config.json")
moment().tz("Europe/Paris")
moment.locale("fr")



const Database = require("@replit/database")
const db = new Database()

client.once("ready", () => {
  console.log("Logged as " + client.user.tag + "(" + client.user.id + ")")
  console.log("Starting prossec...")
  db.get("user_status").then(value => { // si user status existe pas, le crée.
      if(value == null){
        db.set("user_status", "offline").then(() => {});
      }

    });
  var annC = client.channels.cache.get(config.channelid); // channel were message will be posted to
  const user = client.users.cache.get(config.userid) // user who will be check
  checkUser(user, annC, client)
  setInterval(function() { 
    checkUser(user, annC, client) // check tout les 15 secondes
    console.log("Checked.") 
  }, 15 * 1000)

})

client.on("message", async (message) => {
  if(message.author.bot)return;
  if(message.member.hasPermission('ADMINISTRATOR')){
  if(message.content === "!stop")return message.reply("Pour arreter le bot, vous devez faire `!stop confirm`\n:warning: Le seul moyen de redemarer le bot serra de depuis le panel ! :warning:")

  else if(message.content === "!stop confirm"){
    await message.reply("Le bot va s'arreter.")
    await console.log("Une demmande d'arret a été demandé par " + message.author.tag + " à " + new moment())
    client.destroy();
  }else if(message.content === "!verify"){
    var annC = client.channels.cache.get(config.channelid); // channel were message will be posted to
  const user = client.users.cache.get(config.userid) // user who will be check
  checkUser(user, annC, client)
  }
  }
})


require("./server.js")();
client.login(process.env.TOKEN)



function checkUser(user, channeAnn, client){
  if(user.presence.status === "idle" || user.presence.status === "online" || user.presence.status === "dnd"){
      let time = new moment()
      db.get("user_status").then(value => {
        if(value === "online")return;
        else{    
          db.set("user_status", "online").then(() => {
            db.set("user_lastseen", time).then(() => {})
            console.log("on")
            channeAnn.send({embed: {
              title: user.tag + " c'est connecté !",
            description: "À: " + time.format("h[h]mm [et] SS [secondes le ] MMMM Do YYYY"),
            color: "12B533",
            footer: {
              text: "Si le bot spam de message, vous pouvez faire \"!stop\" pour arreter la verification"
              }
            }});
          });
        }
      });
      
      
  }else if(user.presence.status === "offline"){
    db.get("user_status").then(userS => {
      let time = new moment()
      if(userS === "offline")return;
      else{
        console.log('off')
        db.set("user_status", "offline").then(() => {
          db.get("user_lastseen").then(lastseen => {
            channeAnn.send({embed: {
            title: user.tag + "c'est déconecté !",
            description: "À: " + time.format("h[h]mm [et] SS [secondes le ] MMMM Do YYYY") + "\nConnecté pendant :" + moment(lastseen).fromNow(true)
          }})
          })
          
        });
      }
    });
  }
}
