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

const updateEmployee = async (req, res) => {
    /**check if we received an employee id */
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': `Employee id ${req.body.id} not found.` })
    }

    const employee = await Employee.findOne({_id: req.body.id}).exec();
    /**if no employee was found send error code and a message */
    if (!employee) {
        return res.status(204).json({"message": `No employee matches ID ${req.body.id} `});
    }
    /**if the employee with given id is found, update it, along with optional chaining */
    if (req.body?.firstname) employee.firstname = req.body.firstname;
    if (req.body?.lastname) employee.lastname = req.body.lastname;
    const result = await employee.save();
    res.json(result);
}

const deleteEmployee = async (req, res) => {
    /**if no request is sent */
    if(!req?.body?.id) return res.status(400).json({ 'message': 'Employee ID required' });
    const employee = await Employee.findOne({_id: req.body.id}).exec();
    if (!employee) {
        return res.status(204).json({"message": `No employee matches ID ${req.body.id} `});
    }
    /**deleteOne doesnt need exec */
    const result = await employee.deleteOne({_id: req.body.id});
    res.json(result);
}

const getEmployee = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Employee ID required' });
    /**find the single employee */
    const employee = await Employee.findOne({_id: req.params.id}).exec();
    /**if we cant find the employee */
    if (!employee) {
        return res.status(204).json({"message": `No employee matches ID ${req.params.id} `});
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