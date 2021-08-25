const mysql = require('mysql');
const mysql-config = require("../mysql.json);


module.exports.getConnection = () => {
	const db = mysql.createConnection({
		host: config.host,
		port: config.port,
		user: config.user,
		database: config.database,
		password: config.password,
	})
	return db;
}