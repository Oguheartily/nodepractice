/**
 * this credentials file is meant to allow access control for the front end,
 * else they cant get the cookies, CORS will prevent them.
 */
const allowedOrigins = require('../config/allowedOrigins');

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    /** if the origin sending the request is in our allowed origins,
     * then set access control to true
     */
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}

module.exports = credentials;