const express = require('express');
/**app(in express) is used to replace server(in nodejs) */
const app = express();
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 3500;

// custom middleware Logger
app.use( logger );

// apply cors = Cross Origin Resource Sharing
/**the whitelist is to restrict the websites that can use cors, 
 * the address with numbers are only to be used in development mode */
const whitelist = ['http://yoursite.com','https://www.google.com','http://127.0.0.1:5500','http://localhost:3500'];
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
app.use(cors(corsOptions));

/** Built-in middleware to handle url endoced date
 * for form data
 */
// 'Content-Type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

/**built-in middleware for json data */
app.use(express.json());

/** serving static files */
// express searches this public folder before moving to other routes
app.use(express.static(path.join(__dirname, '/public')));

// any request that comes as a get for just the root folder, send a response
/**using regular expressions in express: if it end with a slash or a full domain name, 
 * still load page, (.html)? means its optional, if available still load*/
app.get('^/$|/index(.html)?', (req, res) => {
    /**method 1 of serving a file, specify the root directory and the path to the file within that rood dir */
    // res.sendFile('./views/index.html', { root: __dirname});
    /**method 2, the node method */
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
// serving file in subdirectory
app.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});
app.get('/old-page(.html)?', (req, res) => {
    res.redirect(301, '/new-page.html');
    // sends a 302 by default
    // we want a 301 status redirect so search engines can know that this is a permanent redirect */
});

/** Route Handlers */
app.get('/hello(.html)?', (req, res, next) => {
    console.log('Attempting to load hello.html');
    next();
}, (req, res) => {
    res.send('Hello Everyone, Missed me?');
});

/** Chaining Route handlers */
const one = (req, res, next) => {
    console.log('Chain One');
    next();
}
const two = (req, res, next) => {
    console.log("Chain Two");
    next();
}
const three = (req, res) => {
    console.log("Chain Three");
    res.send("Finito, End of Chain");
}
/**how to use these chained route handler functions */
app.get('/chain(.html)?', [one, two, three]);

/**this is app.use */
// app.get('/*', (req, res) => {
//     res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
//     /* sends a 200 success status code by default for finding the 404 page
//     // we want a 404 status because the page is not in our directory */
// });

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
