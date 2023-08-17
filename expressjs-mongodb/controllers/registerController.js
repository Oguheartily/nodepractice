/**
 * Users usually require registeration and authentication routes
 */
/* importing the mongoose UserSchema */
const User =  require('../model/User');

// install bcrypt, used for hashing password
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if(!user || !pwd) return res.status(400).json({ 'message': 'Username and password required.'});

    // check for duplicate username, looking for a username that matches the one we defined
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) return res.sendStatus(409); /**409 is a conflict error */
    // if no error
    try {
        /**encrypt password */
        const hashedpwd = await bcrypt.hash(pwd, 10);
        /* create and store the new user... */
        const result = await User.create({ 
            "username": user,
            "password": hashedpwd 
        });
        console.log(result);
        res.status(201).json({ "success": `New user ${user} created successfully`});
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };