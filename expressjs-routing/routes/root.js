/**
 * # this is the file for routing users to the root directory pages
 */
const express = require('express');
const router = express.Router();
const path = require('path');

// any request that comes as a get for just the root folder, send a response
/**using regular expressions in express: if it end with a slash or a full domain name, 
 * still load page, (.html)? means its optional, if available still load*/
router.get('^/$|/index(.html)?', (req, res) => {
    /**method 1 of serving a file, specify the root directory and the path to the file within that rood dir */
    // res.sendFile('./views/index.html', { root: __dirname});
    /**method 2, the node method */
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});
// serving file in subdirectory
router.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'new-page.html'));
});
router.get('/old-page(.html)?', (req, res) => {
    res.redirect(301, '/new-page.html');
    // sends a 302 by default
    // we want a 301 status redirect so search engines can know that this is a permanent redirect */
});

module.exports = router;