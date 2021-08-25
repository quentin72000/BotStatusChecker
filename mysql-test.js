const mysql = require('mysql');
const config = require('./config.json');

let time = new Date().getTime();


function getConnection(){
	const db = mysql.createConnection({
		host: config.mysql.host,
		port: config.mysql.port,
		user: config.mysql.user,
		database: config.mysql.database,
		password: config.mysql.password,
	})
	return db;
}
getConnection().connect(function(err) {
	if (err) throw err;
	console.log("Connecté à la base de données MySQL!");
});
// getConnection().query("SELECT * FROM users", function(err, result) {
// 	if(err)throw err;
// 	result.forEach(function(resultt){console.log(resultt.id)})
// })