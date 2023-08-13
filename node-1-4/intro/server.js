/** SOME FEATURES OF NODE */
/** 1. the console log is printed in the terminal window instead of browser */
console.log("Hello Heatily");
/**===================================== */
// 2. global object is used as opposed to window object used by browers
// console.log(global);
/**===================================== */
/** CommonJS module is used instead of ES6. hence require instead of import */
const os = require('os');
const path = require('path');

console.log(os.type());
console.log(os.version());
console.log(os.homedir());
console.log(__dirname);
console.log(__filename);
console.log(path.dirname(__filename));
console.log("The basename is: "+ path.basename(__filename));
console.log("The Extension name is: "+ path.extname(__filename)); //extension name

console.log(path.parse(__filename));
/**===================================== */
/**================= Method 1 Importing Module==================== */
const math = require('../math');
console.log(math.add(5 , 82));
console.log(math.subtract(5 , 82));
console.log(math.multiply(5 , 82));

// if we destructure the module, we can use the function names without using math.add etc
const { add, subtract, multiply, divide } = require('../math');
console.log(add(23, 234));
console.log(multiply(23, 234));
console.log(divide(233, 4));
/**================= Method 2 Importing Module==================== */
const { add2, subtract2, multiply2, divide2 } = require('./math2');

console.log(multiply2(20, 5));
