/**
 * # this controller file stores the functions for CRUD operations
 * # so they can be accessed anywhere without duplication
 */
const data = {
    employees: require('../model/employees.json'),
    setEmployees: function (data) { this.employee = data }
}

const getAllEmployees = (req, res) => {
    res.json(data.employees);
}

const createNewEmployee = (req, res) => {
    /**get last employee in data, add +1 to its id and create the new employee */
    const newEmployee = {
        id: data.employees[data.employees.length - 1].id + 1 || 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }

    if(!newEmployee.firstname || !newEmployee.lastname) {
        return res.status(400).json({ 'message': 'First and Last names are required.' });
    }

    data.setEmployees([...data.employees, newEmployee]);
    /**201 means the record has been created */
    res.status(201).json(data.employee);
}

const updateEmployee = (req, res) => {
    /**check if we received an employee id */
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    /**if no employee was found send error code and a message */
    if (!employee) {
        return res.status(400).json({"message": `Employee ID ${req.body.id} not found`});
    }
    /**if the employee with given id is found, update it */
    if (req.body.firstname) employee.firstname = req.body.firstname;
    if (req.body.lastname) employee.lastname = req.body.lastname;
    /** filter the employees data into an array that doesnt contain the old existing employee data
     * create an unsorted array that doesnt contain the old existing employee*/
    const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    /**unsorted so it can be arranged by id ascrnding */
    const unsortedArray = [...filteredArray, employee];
    data.setEmployees(unsortedArray.sort((a,b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
    res.json(data.employees);
}

const deleteEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    if (!employee) {
        return res.status(400).json({"message": `Employee ID ${req.body.id} not found`});
    }
    const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    data.setEmployees([...filteredArray]);
    res.json(data.employees);
}

const getEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    if (!employee) {
        return res.status(400).json({"message": `Employee ID ${req.params.id} not found`});
    }
    res.json(employee);
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
};