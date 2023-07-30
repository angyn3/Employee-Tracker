const sql = require("mysql2");

const db = sql.createConnection({
    host: "localhost",
    user: process.env.db_user,
    password: process.env.db_password,
    database: "employee_tracker"
});

console.log("Sucessfully connected with the Database!");

module.exports = db;