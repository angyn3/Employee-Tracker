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
            choices: ["View All Departments", "View All Roles", "View All Employees", "Add a Department", "Add New Role", "Add an Employee", "Update Employee", "End Program"]
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

        inquirer.prompt([
        {
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
const addEmployee = () => {
  db.query("SELECT employee.*, role.title AS role_name, manager.first_name AS manager_name FROM employee AS employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id", (err, res) => {
    if (err) throw err;
    const manager = res.map((manage) => ({ name: manage.manager_name, value: manage.id }));
    
    db.query("SELECT * FROM role", (err, res) => {
      const role = res.map((role) => ({ name: role.title, value: role.id }));

      inquirer.prompt([
        {
          name: "first_name",
          type: "input",
          message: "Enter employee's first name",
        },
        {
          name: "last_name",
          type: "input",
          message: "Enter employee's last name",
        },
        {
          name: "role",
          type: "list",
          message: "Enter employee's role",
          choices: role,
        },
        {
          name: "manager",
          type: "list",
          message: "Enter employee's manager",
          choices: manager,
        },
      ]).then((answers) => {
        let first = answers.first_name;
        let last = answers.last_name;
        let roleId = answers.role;
        let managerId = answers.manager;
        db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)", [first, last, roleId, managerId], (err, res) => {
          if (err) throw err;
          console.log("Employee added successfully!");
          init();
        });
      });
    });
  });
};

//Update Employee
const updateEmployee = () => {
    db.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        const employees = res.map((employee => ({name: employee.first_name + " " + employee.last_name, value: employee.id})))

        db.query("SELECT * FROM role", (err, res) => {
            const roles = res.map((role => ({name:role.title, value: role.id})));
        
        inquirer.prompt([{
            name: "employee",
            type: "list",
            message: "Select employee",
            choices: employees
        },
        {
            name: "role",
            type: "list",
            message: "Assign role to employee",
            choices: roles
        }
        ]).then((res) => {
            const updateEmployee = res.employee;
            const updateRole = res.role;

        db.query(`UPDATE employee SET role_id = ? WHERE id = ?;`, [updateRole, updateEmployee], (err) => {
            if (err) throw err;
            console.log("------(Employee role has been updated)-----");
            init();
        });
        });
        });
    });
};



init();