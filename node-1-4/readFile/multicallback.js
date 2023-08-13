const fs = require('fs');
const path = require('path');

/**write and update it in callback function */
fs.writeFile(path.join(__dirname, 'files', 'MainGrain.txt'), "Nice Shoes!", (err) => {
    if(err) throw err;
    console.log("Write Operation complete");

    fs.appendFile(path.join(__dirname, 'files', 'MainGrain.txt'), "Thanks X, \n\n you are such a great friend!", (err) => {
        if(err) throw err;
        console.log("File Updated Successfully");

        fs.rename(path.join(__dirname, 'files', 'newWorld.txt'), (err) => {
            if(err) throw err;
            console.log("Rename was Successfully");
        });
    });
});

/** exit on uncaught exception */
process.on('uncaughtException', (err) => {
    console.error(`there was an uncaught error:  ${err}`);
    process.exit(1);
});

