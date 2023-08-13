const fs = require('fs');
const path = require('path');

/** to avoid different OS interpreting forward and back slashes, let's use the path module to get our path */
// path, sub-directory, filename, utf8 is be default in write mode
fs.writeFile(path.join(__dirname, 'files', 'reply.txt'), "Hey, nice to meet you, this is such a lovely day!", (err) => {
    if(err) throw err;
    console.log("Write Operation complete");
});
/** exit on uncaught exception */
process.on('uncaughtException', err => {
    console.error(`there was an uncaught error:  ${err}`);
    process.exit(1);
});


