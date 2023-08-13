// import our custom module
const logEvents = require('./logEvents');

const EventEmitter = require('events');

class MyEmitter extends EventEmitter {};

// initialize object
const myEmitter = new MyEmitter();

// add event listener
myEmitter.on('log', (msg) => logEvents(msg));

// optional timer
setTimeout(() => {
    // init event
    myEmitter.emit('log', 'Log Event Emitted');
}, 2000);