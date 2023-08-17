const { format } = require('date-fns');
// after installing uuid
const { v4: uuid } = require('uuid');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (message, logName) => {
    const dateTime = (format(new Date(), 'yyyy-MM-dd\tHH:mm:ss'));
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    // console.log(logItem);
    try {
        /**going one directory up, out of the middleware folder */
        if(!fs.existsSync(path.join(__dirname, '..', 'logs'))){
            fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem);
    } catch (err) {
        console.error(err);
    }

    
}
// custom logger function to be called anywhere
    const logger = (req, res, next) => {
        // logEvents(message and file to write to)
        logEvents(`${req.method}\t${req.header.origin}\t${req.url}`, 'reqLog.txt');
        console.log(`${req.method} ${req.path}`);
        next();
    }
module.exports = { logger, logEvents };