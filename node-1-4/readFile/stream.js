/** the purpose of this file is to test how files are read chunk by chunk till the end */
const fs = require('fs');

const rs = fs.createReadStream('./files/lorem.txt', {encoding: 'utf8'});

const ws = fs.createWriteStream('./files/new-lorem.txt');

// rs.on('data', (datachunk) => {
//     ws.write(datachunk);
// });

/**another more efficient way is */
rs.pipe(ws);

