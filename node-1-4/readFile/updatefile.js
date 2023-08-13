const fs = require('fs');
const path = require('path');

/** to avoid different OS interpreting forward and back slashes, let's use the path module to get our path */
// path, sub-directory, filename, utf8 is be default in write mode
fs.appendFile(path.join(__dirname, 'files', 'appender.txt'), "We are tring to append a text to a file!", (err) => {
    if(err) throw err;
    console.log("File Updated");
});

/** exit on uncaught exception */
process.on('uncaughtException', err => {
    console.error(`there was an uncaught error:  ${err}`);
    process.exit(1);
});

