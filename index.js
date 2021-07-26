const Discord = require("discord.js");
const client = new Discord.Client;
var moment = require('moment-timezone');
const config = require("./config.json")
moment().tz("Europe/Paris");
moment.locale("fr");


const users = require("./users.json").users;
const channels = require("./channels.json").channels;

const Database = require("@replit/database")
const db = new Database()

client.once("ready", () => {
  console.log("Logged as " + client.user.tag + "(" + client.user.id + ")")
  console.log("User to check:" + users.length)
  console.log("Channel to send notifications: " + channels.length)
  console.log("Starting prossec...")
  
  
  checkUser()
  setInterval(function() { 
    checkUser() // check tout les 15 secondes
    console.log("Checked.") 
  }, 15 * 1000)

})

client.on("message", async (message) => {
  if(message.author.bot)return;
  if(message.member.hasPermission('ADMINISTRATOR')){
  if(message.content === "s.stop")return message.reply("Pour arreter le bot, vous devez faire `s.stop confirm`\n:warning: Le seul moyen de redemarer le bot serra de depuis le panel ! :warning:")

  else if(message.content === "s.stop confirm"){
    await message.reply("Le bot va s'arreter.")
    await console.log("Une demmande d'arret a été demandé par " + message.author.tag + " à " + new moment())
    client.destroy();
  }else if(message.content === "s.verify"){
  
  checkUser()
  }
  }
})


require("./server.js")();
client.login(process.env.TOKEN)

function checkUser(channelAnn){
  
  let users = require("./users.json").users
  let channels = require("./channels.json").channels
  users.forEach(userID => {
    const user = client.users.cache.get(userID)
    if(user.presence.status === "idle" || user.presence.status === "online" || user.presence.status === "dnd"){
      let time = new moment()
      db.get("user_" + user.id + "_status").then(status => {
        if(status === "online")return;
        
        else{    
          db.set("user_" + user.id + "_status", "online").then(() => {
            db.set("user_"+ user.id +"_connectAt", time).then(() => {})
            db.get("user_" + user + "_lastseen").then(lastseen => {
              sendToAllChannelEmbed(user.tag, user.displayAvatarURL({dynamic:true}), user.tag + " c'est connecté !", "À: " + time.format("HH[h]mm [et] SS [secondes le ] Do MMMM YYYY") + "\nDéconnecté pendant: " + moment(lastseen).fromNow(true), "12B533")
           /*   channelAnn.send({embed: {
                title: user.tag + " c'est connecté !",
              description: "À: " + time.format("HH[h]mm [et] SS [secondes le ] Do MMMM YYYY") + "\nDéconnecté pendant: " + moment(lastseen).fromNow(true),
              color: "12B533",
              footer: {
                text: "Si le bot spam de message, vous pouvez faire \"!stop\" pour arreter la verification"
                }
              }}); */
            })
            console.log("on")
            
          });
        }
      });
      
      
  }else if(user.presence.status === "offline"){
    let time = new moment()
    db.get("user_" + user.id + "_status").then(userS => {
      
      if(userS === "offline")return;
      else{
        console.log('off')
        db.set("user_" + user.id + "_status", "offline").then(() => {
          db.get("user_"+ user.id + "_connectAt").then(connectAt => {
            sendToAllChannelEmbed(user.tag, user.displayAvatarURL({dynamic:true}),user.tag + " c'est déconecté !", "À: " + time.format("HH[h]mm [et] SS [secondes le ] Do MMMM YYYY") + "\nConnecté pendant :" + moment(connectAt).fromNow(true))
            // channelAnn.send({embed: {
            //   author: {
		        //     name: user.tag,
		        //     icon_url: user.displayAvatarURL({dynamic:true})
            //   },
            //   title: user.tag + " c'est déconecté !",
            //   description: "À: " + time.format("HH[h]mm [et] SS [secondes le ] Do MMMM YYYY") + "\nConnecté pendant :" + moment(connectAt).fromNow(true)
            // }})
          db.set("user_" + user.id + "_lastseen", time)
          })
          
        });
      }
    });
  }
});
}


function sendToAllChannelEmbed(authorName, authorAvatarUrl, title, description, color){
  const channels = require("./channels.json").channels;
  channels.forEach(channelID => {
    const channel = client.channels.cache.get(channelID);
    channel.send({embed: {
      author: {
        name: authorName,
        icon_url: authorAvatarUrl,
      },
      title: title,
      color: color,
      description: description
    }})
  })
  
}
