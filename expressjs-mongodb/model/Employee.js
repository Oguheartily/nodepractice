/**while testing, we used offline json file to hold all employees data, this js file is the online mongodb version */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    }
});
/** The first argument is the singular name of the collection your model is for. Mongoose automatically looks for the plural, lowercased version of your model name, so it first looks for employees */
module.exports = mongoose.model('Employee', employeeSchema);
