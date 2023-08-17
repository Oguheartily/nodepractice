const jwt = require('jsonwebtoken');


const verifyJWT = (req, res, next) => {
    /**this is in case the front end developer used capital A in the authorization */
    const authHeader = req.headers.authorization || req.headers.Authorization;
    /**if we do not have an auth header or it doesn't start with Bearer and a space, then send a 401 error response code because its not a 
     * correctly formed authorization.
    */
    if(!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    /**this is what seperates the token into bearer and tokenValue by a space, seperate at second word, ie index 1 */
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); /**invalid token */
            /* set username */
            req.user = decoded.UserInfo.username;
            /* set the roles */
            req.roles = decoded.UserInfo.roles;
            next();
        }
    );
}

module.exports = verifyJWT;