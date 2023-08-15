/**
 * # this is the file for routing all employees to the employee directory pages
 */
const express = require('express');
const router = express.Router();
/**import the controller which contains all the functions */
const employeesController = require('../../controllers/employeesController');

/**get = get a record, post = send a record, put = update, delete = remove record */
router.route('/')
    .get(employeesController.getAllEmployees)
    .post(employeesController.createNewEmployee)
    .put(employeesController.updateEmployee)
    .delete(employeesController.deleteEmployee);
    /**by creating the controller seperately, the code is now cleaner */

    /** if an id is placed directly in the url, this is how we get it's parameters */
router.route('/:id')
    .get(employeesController.getEmployee);

module.exports = router;