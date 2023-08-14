/**
 * Users usually require registeration and authentication routes
 */
// the code below looks like a react state
const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
/* for hashing password */
const bcrypt = require('bcrypt');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if(!user || !pwd) return res.status(400).json({ 'message': 'Username and password required.'});
    const foundUser = usersDB.users.find(person => person.username === user);
    if(!foundUser) return res.status(401); /**unauthorised status code */
    /**evaluate password */
    const match = await bcrypt.compare(pwd, foundUser.password);
    if(match) {
        /* create JWT */
        res.json({ 'success': `User ${user} is logged in!`});
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };