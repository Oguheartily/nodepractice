/**
 * handle logout, and clearout refresh and access tokens.
 */
/* importing the mongoose UserSchema */
const User =  require('../model/User');

const handleLogout = async (req, res) => {
    /**for front-end dev on client side, also delete the access token */
    const cookies = req.cookies;
    /**check if we have cookies, also optionally check if it has jwt properties */
    if(!cookies?.jwt) return res.sendStatus(204); /**no content to send back */
    const refreshToken = cookies.jwt;

    /**check if refresh token is in database */
    const foundUser = await User.findOne({ refreshToken }).exec();
    if(!foundUser) {
        /**if there is no loggen in user but there is a n active refresh token, then clear it */
        res .clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }
    /**delete the found refresh token */
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result);
/*    delete the cookie, in production mode, set secure: true,
this only sends cookie on a secure connection */
res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
res.sendStatus(204);
    
}

module.exports = { handleLogout };
/**now create a route file */