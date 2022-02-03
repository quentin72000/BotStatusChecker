const { Client, Collection } = require("discord.js");
require("dotenv").config();
const db_request = require("./utils/db-request");

const client = new Client({
    intents: 32767,
});

// DB setup
const sqlite = require("sqlite3")
let db = new sqlite.Database('./db.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE)

db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, result) => { // check if db is empty or incomplete
    if(err) return console.error(err)
    if(!result || !(result.some(e => e.name = "users") && result.some(e => e.name = "guilds"))){ // (re)create it if empty or incomplete
        console.log("DB is empty, missing a table or is corrupted, (re)creating...");
        createDBTable()
    }
})


client.db = db

module.exports = client;

// Global Variables
client.commands = new Collection();
client.slashCommands = new Collection();

client.config = require("./config.json");

// Initializing the project
require("./handler")(client);
client.login(process.env.TOKEN);



async function createDBTable () {
    db.serialize(async() =>{
        await db.run(db_request.create.users, (err) => { // create users table
            if(err){
                console.error("An error occurred while creating users table")
                console.error(err);
                prosses.exit(1)
            }
        })
        await db.run(db_request.create.guilds, (err) => { // create guilds table
            if(err){
                console.error("An error occurred while creating users table")
                console.error(err);
                return prosses.exit(1)
            }
        else console.log("Database successfully (re)created")

        })
    })
    
}
