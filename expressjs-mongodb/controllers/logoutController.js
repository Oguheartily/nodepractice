/**
 * handle logout, and clearout refresh and access tokens.
 */
// the code below looks like a react state
const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async (req, res) => {
    /**for front-end dev on client side, also delete the access token */
    const cookies = req.cookies;
    /**check if we have cookies, also optionally check if it has jwt properties */
    if(!cookies?.jwt) return res.sendStatus(204); /**no content to send back */
    const refreshToken = cookies.jwt;

    /**check if refresh token is in db */
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    if(!foundUser) {
        /**if there is no loggen in user but there is a n active refresh token, then clear it */
        res .clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }
    /**delete the found refresh token */
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    /* the found user refresh token is set to blank or empty string and hereforth stored as current user */
    const currentUser = {...foundUser, refreshToken: ''};
    /** then update database with this empty refresh token */
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(usersDB.users)
    );
/*    delete the cookie, in production mode, set secure: true,
this only sends cookie on a secure connection */
res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
res.sendStatus(204);
    
}

module.exports = { handleLogout };
/**now create a route file */