//no need to require dotenv, the variables are available globally when server.js runs
const mysql = require("mysql2");

 const db = mysql.createConnection({
    host: process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE,
    multipleStatements: true,
})


db.connect((err) => {
    if(err) throw err;
    console.log("connected to mysql db")
})

module.exports = db