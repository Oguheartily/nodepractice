/**
 * Users usually require registeration and authentication routes
 */
// the code below looks like a react state
const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
const fsPromises = require('fs').promises;
const path = require('path');
// install bcrypt, used for hashing password
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if(!user || !pwd) return res.status(400).json({ 'message': 'Username and password required.'});

    // check for duplicate username
    const duplicate = usersDB.users.find(person => person.username === user);
    if (duplicate) return res.sendStatus(409); /**409 is a conflict error */
    // if no error
    try {
        /**encrypt password */
        const hashedpwd = await bcrypt.hash(pwd, 10);
        /* store the new user... usersDB.setUsers([...usersDB.users, newUser]); the square bracket in this code is very important */
        const newUser = { 
            "username": user,
            "roles": { "User": 2001 },
            "password": hashedpwd 
        };
        usersDB.setUsers([...usersDB.users, newUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        console.log(usersDB.users);
        res.status(201).json({ "success": `New user ${user} created successfully`});
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };