const mysql = require('mysql');
const { db } = require('../config.json');

const DBConnection = mysql.createConnection({
	host: db.host,
	port: db.port,
	database: db.database,
	user: db.user,
	password: db.password
});

DBConnection.connect();

module.exports.DBConnection = DBConnection;