const fs = require('fs');
const path = require('path');

fs.readFile('./files/starter.txt', (err, data) => {
    if(err) throw err;
    console.log(data);
    console.log(data.toString());
});

// this is to demonstrate asynchronicity of node
console.log("Wait, did Elon musk actually change Twitter to X?"); 

fs.readFile('./files/starter.txt', 'utf8', (err, data) => {
    if(err) throw err;
    console.log(data);
});


/** exit on uncaught exception */
process.on('uncaughtException', err => {
    console.error(`there was an uncaught error:  ${err}`);
    process.exit(1);
});

/** to avoid different os interpreting forward and back slashes, let's use the path module to get our path */
// path, sub-directory, filename
fs.readFile(path.join(__dirname, 'files', 'starter.txt'), 'utf8', (err, data) => {
    if(err) throw err;
    console.log(data);
});
