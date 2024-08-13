const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

var db = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    port: process.env.DB_PORT,
    timezone: 'Z'
});


	
db.connect(function(err) {
    if(err) {
        throw err
    }
    console.log("Database connected");
});

module.exports=db;