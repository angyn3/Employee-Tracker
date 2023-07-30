const inquirer = require("inquirer");
const db = require("./db/connection.js");



const init = () => {
    console.log("---------------EMPLOYEE TRACKER-------------------")

    return inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do",
            choices: ["View All Departments", "View All Roles", "View All Employees", "Add a Department", "Add New Role", "Add New Employee", "Update Employee Role", "End Program"]
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
            case "Add New Employee":
                addEmployee();
                break;
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
    db.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    });
};

//View All Employees
const viewAllEmployees = () => {
    db.query("SELECT * FROM employee", (err, res) => {
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

// Add New Employee




init();