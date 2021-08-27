const mysql = require('mysql');
require("dotenv").config();


module.exports.getConnection = () => {
	const db = mysql.createConnection({
		host: process.env.HOST,
		port: process.env.PORT,
		user: process.env.USER,
		database: process.env.DATABASE,
		password: process.env.PASSWORD,
	})
	return db;
}