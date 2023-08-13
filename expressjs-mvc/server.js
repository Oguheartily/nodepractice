const express = require('express');
/**app(in express) is used to replace server(in nodejs) */
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
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

/** serving static files */
// express searches this public folder before moving to other routes
app.use('/', express.static(path.join(__dirname, '/public')));
/**routes, this directs us to the right pages */
app.use('/', require('./routes/root'));
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