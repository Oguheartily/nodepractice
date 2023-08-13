const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

// import our custom module
const logEvents = require('./logEvents');
const EventEmitter = require('events');
const { log } = require('console');

class Emitter extends EventEmitter {};
// initialize object
const myEmitter = new Emitter();
// listen for any log events
myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName));
const PORT = process.env.PORT || 3500;

// function to serve file to avoid repetition of code for various file formats
const serveFile = async (filePath, contentType, response) => {
    try {
        /**for us to serve image files, we edit the following */
        const rawData = await fsPromises.readFile(
            filePath, 
            /**if content type is not image, serve utf8 else leave it as string */
            !contentType.includes('image') ? 'utf-8' : ''
        );
        const data = contentType === 'application/json'
            ? JSON.parse(rawData) : rawData;

        // send the response but check if the url extension is 404.html, if true, send error code or a success code
        response.writeHead(
            filePath.includes('404.html') ? 404 : 200, 
            {'Content-Type': contentType});
        response.end(
            contentType === 'application/json' ? JSON.stringify(data) : data
        );
    } catch (err) {
        console.error(err);
        /**track any errors in our log file */
        myEmitter.emit('log', `${err.name}: ${err.message}`, 'errLog.txt');
        response.statusCode = 500;
        response.end();
    }
}

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    // send something to the log file
    myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt');

    const extension = path.extname(req.url);
    let contentType;

    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
    
        default:
            contentType = 'text/html';
            break;
    };

    // chained ternary operation
    let filePath =
    contentType === 'text/html' && req.url === '/'
        ? path.join(__dirname, 'views', 'index.html')
        : contentType === 'text/html' && req.url.slice(-1) === '/'
            ? path.join(__dirname, 'views', req.url, 'index.html')
            : contentType === 'text/html'
                ? path.join(__dirname, 'views', req.url)
                : path.join(__dirname, req.url);

    /**if the person type a file name like about or contact, without an extension, 
     * the conditions above will not match, so we handle that with an if statement  */
    if(!extension && req.url.slice(-1) !== '/') filePath += '.html';

    // if the file exists in our directory
    const fileExists = fs.existsSync(filePath);

    if(fileExists) {
        // serve the file using the function
        serveFile(filePath, contentType, res);
    } else {
        // load 404 page
        // 301 redirect
        switch(path.parse(filePath).base){
            case 'old-page.html':
                res.writeHead(301, {'Location': '/new-page.html'});
                res.end();
                break;
            case 'www.page.html':
                res.writeHead(301, {'Location': '/'});
                res.end();
                break;
            default:
                // serve 404 response using same function
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);
        }
    }

    /**Good but inefficient method, thats why we used the ternary operation above */
    // let filePath;
    // if(res.url === '/' || req.url === 'index.html') {
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'text/html');
    //     filePath = path.join(__dirname, 'views', 'index.html');
    //     fs.readFile(filePath, 'utf-8', (err, data) => {
    //         res.end(data);
    //     });
    // }
});
server.listen(PORT, () => console.log(`Our Server is Running on port ${PORT}`));
