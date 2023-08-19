/**pass in as many parameters as possible,
 * recall that admin has user role, editor role and admin role,
 * while editor has user role and editor role, hence why we are checking all allowed roles for a particular logged in user
 */
const verifyRoles = (...allowedRoles) => {
    /**return anonymous missleware function */
    return (req, res, next) => {
        /**on getting here, verifyjwt would have checked but just to be sure,
         * if there is no request or the request does not have a roles,
         * send a 401 - unauthorized status code.
         */
        if (!req?.roles) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        /**possible roles that this user can access */
        console.log(`Current User roles: ${rolesArray}`);
        /**all arrays of roles coming from verifyjwt */
        console.log(`All possible allowed rolls ${req.roles}`);
        /** */
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
        /**if we do not find a result, ie no tru value means the role of the user is not in all roles, send  */
        if (!result) return res.sendStatus(401);
        next();
    }
}

module.exports = verifyRoles;