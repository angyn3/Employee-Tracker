require('dotenv').config()
const inquirer = require("inquirer");
const db = require("./db/connection.js");



const init = () => {
    console.log("---------------EMPLOYEE TRACKER-------------------")

    return inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do",
            choices: ["View All Departments", "View All Roles", "View All Employees", "Add a Department", "Add New Role", "Add an Employee", "Update Employee Role", "End Program"]
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
            case "Add New Role":
                addNewRole();
                break;
            // case "Add an Employee":
            //     addEmployee();
            //     break;
            // case "Update Employee":
            //     updateEmployee();
            //     break;
            case "End Program":
                db.end();
                break;
        }
    })
}

// View All Departments
const viewAllDepartments = () => {
    db.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    });
};

//View All Roles
const viewAllRoles = () => {
    const query = `
        SELECT
            employee.id AS "Unique ID",
            employee.first_name,
            employee.last_name,
            role.title AS job_title,
            department.name AS department,
            role.salary,
            CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM
            employee
            LEFT JOIN role ON employee.role_id = role.id
            LEFT JOIN department ON role.department_id = department.id
            LEFT JOIN employee manager ON employee.manager_id = manager.id;
    `;
    db.query(query, (err, res) =>{
        if (err) throw err;
        console.table(res);
        init();
    });
};

//View All Employees
const viewAllEmployees = () => {
    const query = `
        SELECT
            employee.id AS "Unique ID",
            employee.first_name,
            employee.last_name,
            role.title AS job_title,
            department.name AS department,
            role.salary,
            CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM
            employee
            LEFT JOIN role ON employee.role_id = role.id
            LEFT JOIN department ON role.department_id = department.id
            LEFT JOIN employee manager ON employee.manager_id = manager.id;
    `;

    db.query(query, (err, res) =>{
        if (err) throw err;
        console.table(res);
        init();
    });
};

//Add A Department
const addDepartment = () => {
    inquirer.prompt([{
        name: "department",
        type: "input",
        message: "Select new department"

    }]).then(res => {
        let userInput = res.department
        db.query("INSERT INTO department (name) Values (?)", [userInput])
        console.log(`New Department Recognized Name: ${userInput}`)
        init();
    });
};

//Add New Role
const addNewRole = () => {
    db.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        const department = res.map((department) => ({ name: department.name, value: department.id }));

        inquirer.prompt([{
            name: "title",
            type: "input",
            message: "Please enter new role",
        },
        {
            name: "salary",
            type: "input",
            message: "Please enter salary amount",
        },
        {
            name: "department",
            type: "list",
            message: "Please select department",
            choices: department,
        },
        ]).then(res => {
            if (err) throw err;
            let newRole = res.title
            let newSalary = res.salary
            let newDept = res.department

            db.query("INSERT INTO role (title, salary, department_id) Values (?,?,?)", [newRole, newSalary, newDept])
            if (err) throw err;
            console.log(`New Role has been Added name: ${newRole}`)
            init();
        })
    })
}

// Add an Employee




init();