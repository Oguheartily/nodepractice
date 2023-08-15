const express = require('express');
/**app(in express) is used to replace server(in nodejs) */
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
/**import jwt authorization */
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 3500;

// custom middleware Logger
app.use( logger );

/**call cors options function that prevents unwanted url from accessing the backend */
app.use(cors(corsOptions));

/** Built-in middleware to handle url endoced form data */
// 'Content-Type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

/**built-in middleware for json data */
app.use(express.json());

/**middleware for cookies */
app.use(cookieParser());

/** serving static files */
// express searches this public folder before moving to other routes
app.use('/', express.static(path.join(__dirname, '/public')));
/**routes, this directs us to the right pages */
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
/** the refresh endpoint will receive the cookie that has the refresh token
 * and that will isssue a new accrss token once the access token has expired
 */

/** jwt cannot be checked before the above routes but we need 
 * if a person is trying to access anything that has to do with employees 
 * so those that dont need a token, stay above it, so it doesnt affect them */
app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));

/**this is app.all */
app.all('*', (req, res) => {
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        req.json({ error: "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

/** custom error handler for express */
app.use(errorHandler);

app.listen(PORT, () => console.log(`Our Server is Running on port ${PORT}`));