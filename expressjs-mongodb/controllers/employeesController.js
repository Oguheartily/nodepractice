/**
 * # this controller file stores the functions for CRUD operations
 * # so they can be accessed anywhere without duplication
 */
/* importing the mongoose UserSchema */
// const Employee =  require('../model/Employee');
const Employee = require('../model/Employee');

const getAllEmployees = async (req, res) => {
    /**calling find without parameter will return all employees */
    const employees = await Employee.find();
    if (!employees) return res.status(204).json({
        'message': 'No employees found.'
    });
    res.json(employees);
}

const createNewEmployee = async (req, res) => {
    /**if there is no firstname or lastname */
    if (!req?.body.firstname || !req?.body.firstname ) {
        return res.status(400).json({ 'message': 'First and Last names are required.' })
    }

    try {
        const result = await Employee.create({
            firstname: req.body.firstname,       
            lastname: req.body.lastname       
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const updateEmployee = (req, res) => {
    /**check if we received an employee id */
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': `Employee id ${req.body.id} not found.` })
    }
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