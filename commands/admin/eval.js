const { Message, Client } = require("discord.js");
module.exports = {
    name: "eval",
    aliases: ['exec', "execute"],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        if(!client.config.whitelistUsers.includes(message.author.id))return message.reply("Error: You can't do that.");
        if(message.author.id !==  "611938209366016000") return;
        let content = message.content.split(" ").slice(1).join(" ");
        if (content.includes("env.TOKEN")) content.replace("env.TOKEN", "NOP");
        if (content.includes("config.token")) content.replace("config.token", "NOP")
        const result = new Promise((resolve, reject) => resolve(eval(content)));
        
        return result.then((output) => {
            if(typeof output !== "string"){
                output = require("util").inspect(output, { depth: 0 });
            }
            if(output.includes(client.token)){
                output = output.replace(message.client.token, "T0K3N");
            }
            message.channel.send(output, {
                code: "js"
            });  
        }).catch((err) => {
            err = err.toString();
            if(err.includes(message.client.token)){
                err = err.replace(message.client.token, "T0K3N");
            }
            message.channel.send(err, {
                code: "js"
            });
        });
    },
};
