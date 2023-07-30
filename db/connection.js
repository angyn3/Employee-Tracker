const sql = require("mysql2");

const db = sql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "employee_tracker"
});

console.log("Sucessfully connected with the Database!");

module.exports = db;