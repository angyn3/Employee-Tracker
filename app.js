const inquirer = require("inquirer");
const db = requirer("./db/connection.js");


const init = () => {
    console.log("---------------EMPLOYEE TRACKER-------------------")

    return inquirer.createPromptModule([
        {
            type: "list",
            name: "action",
            message: "What would you like to do",
            choices: ["View All Departments", "View All Roles", "View All Employees", "Add a Department", "Add a Role", "Add an Employee", "Update Employee Role", "End Program"]
        }

    ]).then(res => {
        switch (res.action) {
            case "View All Departments":
                viewAllDepartments();
                break;
            case "View All Roles":
                viewAllRoles();
                break;
            case "View All Employees":
                viewAllEmployees();
                break;
            case "Add a Department":
                addDepartment();
                break;
            case "Add a Role":
                addRole();
                break;
            case "Add an Employee":
                addEmployee();
                break;
            case "Update Employee":
                updateEmployee();
                break;
            case "End Program":
                db.end();
                break;
        }
    })
}