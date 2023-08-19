/**
 * Users usually require registeration and authentication routes
 */
/* importing the mongoose UserSchema */
const User =  require('../model/User');

/* import json web token */
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    // console.log(cookies);
    /**check if we have cookies, also optionally check if it has jwt properties */
    if(!cookies?.jwt) return res.sendStatus(401);
    // console.log(cookies.jwt);
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();
    if(!foundUser) return res.sendStatus(403); /**unauthorised status code */
    
    /**evaluate jwt */
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                { 
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '2m'}
            );
            res.json({ accessToken });
        }
    );
    
}

module.exports = { handleRefreshToken };