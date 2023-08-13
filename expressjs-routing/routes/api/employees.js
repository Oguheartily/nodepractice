/**
 * # this is the file for routing all employees to the employee directory pages
 */
const express = require('express');
const router = express.Router();
const data = {};
data.employees = require('../../data/employees.json');

/**get = get a record, post = send a record, put = update, delete = remove record */
router.route('/')
    .get((req, res) => {
        res.json(data.employees);
    })
    .post((req, res) => {
        res.json({
            "firstname": req.body.firstname,
            "lastname": req.body.lastname
        });
    })
    .put((req, res) => {
        res.json({
            "firstname": req.body.firstname,
            "lastname": req.body.lastname
        });
    })
    .delete((req, res) => {
        res.json({ "id": req.body.id });
    });

    /** if an id is placed directly in the url, this is how we get it's parameters */
router.route('/:id')
    .get((req, res) => {
        res.json({ "id": req.params.id});
    });

module.exports = router;