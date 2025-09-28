const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let employees = [];

function showMenu() {
  console.log('\n=== Employee Management System ===');
  console.log('1. Add Employee');
  console.log('2. List Employees');
  console.log('3. Remove Employee');
  console.log('4. Exit');
  rl.question('Choose an option (1-4): ', handleMenu);
}

function handleMenu(choice) {
  switch (choice.trim()) {
    case '1':
      addEmployee();
      break;
    case '2':
      listEmployees();
      break;
    case '3':
      removeEmployee();
      break;
    case '4':
      console.log('Exiting... Goodbye!');
      rl.close();
      break;
    default:
      console.log('Invalid choice. Please select 1-4.');
      showMenu();
      break;
  }
}

function addEmployee() {
  rl.question('Enter employee name: ', (name) => {
    rl.question('Enter employee ID: ', (id) => {
      const exists = employees.find(emp => emp.id === id);
      if (exists) {
        console.log(`Employee ID ${id} already exists. Try again.`);
      } else {
        employees.push({ name, id });
        console.log(`Employee ${name} ID: ${id} added successfully`);
      }
      showMenu();
    });
  });
}

function listEmployees() {
  if (employees.length === 0) {
    console.log('No employees found.');
  } else {
    console.log('\n--- Employee List ---');
    employees.forEach(emp => {
      console.log(`Name: ${emp.name}, ID: ${emp.id}`);
    });
  }
  showMenu();
}

function removeEmployee() {
  rl.question('Enter employee ID to remove: ', (id) => {
    const index = employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      const removed = employees.splice(index, 1)[0];
      console.log(`Employee ${removed.name} ID: ${removed.id} removed successfully`);
    } else {
      console.log(`Employee ID ${id} not found`);
    }
    showMenu();
  });
}

showMenu();
