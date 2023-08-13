const express = require('express');
/**app(in express) is used to replace server(in nodejs) */
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500;

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

app.get('/*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
    // sends a 200 success status code by default
    // we want a 404 status because the page is not in our directory */
});


app.listen(PORT, () => console.log(`Our Server is Running on port ${PORT}`));
