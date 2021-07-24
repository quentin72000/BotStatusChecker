const Database = require("@replit/database")
const db = new Database()

db.get("user_611938209366016000_status").then(value => {console.log(value)});
