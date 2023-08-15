/** whiteList has been changed to a seperate file called allowedOrigins in the config folder*/
const allowedOrigins = require('./allowedOrigins');
/**this is the function that makes cors allow the whitelist specified websites to access the backend */
const corsOptions = {
    // origin i.e options: (origin ie origin from the requester, callback) => {
    origin: (origin, callback) => {
        /* if the domain (origin) is in the whitelist, callback 
            the !origin is to prevent undefined error during development,
            hence it should be removed for final commercial build. */
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            /** null means no error, true means the origin will be sent back that its the right resource seeked */
            callback(null, true);
        } else{
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus : 200
}

module.exports = corsOptions;