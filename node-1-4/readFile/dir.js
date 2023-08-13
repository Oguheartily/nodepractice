/** Create a folder ie directory */
const fs = require('fs');

/**if folder exist, don't create it, this is a very important code*/
if(!fs.existsSync('./new')){
    fs.mkdir('./new', (err) => {
        if(err) throw err;
        /**else */
        console.log("New Directory Created in Files folder");
    });
}
else{
    console.log("Folder already exists");
}

// the else statement prevents this code from running, it could be placed in the else also
/**if folder exist, remove it */
if(fs.existsSync('./new')){
    fs.rmdir('./new', (err) => {
        if(err) throw err;
        /**else */
        console.log("Directory Removed");
    });
}