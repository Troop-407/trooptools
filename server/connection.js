const mysql = require('mysql');

// create connection to mysql db
const connection = mysql.createConnection({ 
    host     : 'localhost',
    user     : 'root',
    password : '', 
    database : 'troop407'
 })

// connect to db
// error thrown if connection could not be established
connection.connect(function(err) {
    if (err) throw err;
    console.log("DB up and running");
});

// export as a global
module.exports = connection