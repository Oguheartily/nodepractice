// apply cors = Cross Origin Resource Sharing
/**the whitelist is to restrict the websites that can use cors, 
 * the address with numbers are only to be used in development mode */

const allowedOrigins = [
    'http://yoursite.com',
    'https://www.google.com',
    'http://127.0.0.1:5500',
    'http://localhost:3500'
];

module.exports = allowedOrigins;