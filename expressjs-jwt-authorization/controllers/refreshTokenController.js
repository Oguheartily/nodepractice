/**
 * Users usually require registeration and authentication routes
 */
// the code below looks like a react state
const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
/* import json web token */
const jwt = require('jsonwebtoken');
/** import the env file which contains the access token */
require('dotenv').config();

const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;
    console.log(cookies);
    /**check if we have cookies, also optionally check if it has jwt properties */
    if(!cookies?.jwt) return res.sendStatus(401);
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;

    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    if(!foundUser) return res.sendSstatus(403); /**unauthorised status code */
    
    /**evaluate jwt */
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const accessToken = jwt.sign(
                { "usernsme": decoded.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1m'}
            );
            res.json({ accessToken });
        }
    );
    
}

module.exports = { handleRefreshToken };