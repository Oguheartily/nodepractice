/**
 * Users usually require registeration and authentication routes
 */
/* importing the mongoose UserSchema */
const User =  require('../model/User');

/* for hashing password */
const bcrypt = require('bcrypt');
/* import json web token */
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password required.' });
    const foundUser = await User.findOne({ username: user }).exec();
    // const foundUser = usersDB.users.find(person => person.username === user);
    if (!foundUser) return res.status(401); /**unauthorised status code */
    /**evaluate password */
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        /**after checking if user match a person in our db, get his user role */
        const roles = Object.values(foundUser.roles);

        /* create JWTs, do not pass in password, access expiration time 15m is oke, but for testing, we used 30s*/
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1m' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        /** saving refresh token with current user, and invalidate after logout.
         * this creates an array of other users that are not the currently loggen in user */
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);

        /**though storing access toke in cookie is wrong, if we store it as httpOnly cookie, it cannot be accessed bt javascript */
        /**nameOfCookie, cookie sent, exp time 24h */
        // res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
        /**access token sent as json so the front end developer can grab and use */
        res.json({ accessToken });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };