/**
 * # this is the file for routing all employees to the employee directory pages
 */
const express = require('express');
const router = express.Router();
/**import the controller which contains all the functions */
const employeesController = require('../../controllers/employeesController');

const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');
/**get = get a record, post = send a record, put = update, delete = remove record */
router.route('/')
    .get(employeesController.getAllEmployees)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.createNewEmployee)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.updateEmployee)
    .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee);
    /**by creating the controller seperately, the code is now cleaner...
     * only admin is allowd to delete, but editor can post & update data.
     */

    /** if an id is placed directly in the url, this is how we get it's parameters */
router.route('/:id')
    .get(employeesController.getEmployee);

module.exports = router;