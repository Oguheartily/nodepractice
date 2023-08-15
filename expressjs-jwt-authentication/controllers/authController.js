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
/* import json web token */
const jwt = require('jsonwebtoken');
/** import the env file which contains the access token */
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');



const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if(!user || !pwd) return res.status(400).json({ 'message': 'Username and password required.'});
    const foundUser = usersDB.users.find(person => person.username === user);
    if(!foundUser) return res.status(401); /**unauthorised status code */
    /**evaluate password */
    const match = await bcrypt.compare(pwd, foundUser.password);
    if(match) {
        /* create JWTs, do not pass in password, access expiration time 15m is oke, but for testing, we used 30s*/
        const accessToken = jwt.sign(
            {"username": foundUser.username},
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1m' }
        );
        const refreshToken = jwt.sign(
            {"username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        /** saving refresh token with current user, and invalidate after logout.
         * this creates an array of other users that are not the currently loggen in user */
        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
        const currentUser = { ...foundUser, refreshToken };
        usersDB.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        /**though storing access toke in cookie is wrong, if we store it as httpOnly cookie, it cannot be accessed bt javascript */
        /**nameOfCookie, cookie sent, exp time 24h */
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
        /**access token sent as json so the front end developer can grab and use */
        res.json({ accessToken });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };