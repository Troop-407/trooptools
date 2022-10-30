const jwt = require('jsonwebtoken')
// class containing methods for generic actions
class Utilities {
    // create an httponly cookie
    createHttpOnlyCookie(cookieName, res, jwt) {
        res.cookie(cookieName, jwt, {
            httpOnly: true,
            sameSite: "strict",
        });
    }
    // creates jwt for all clients (all form requests require a jwt)
    createWebJWT() {
        return jwt.sign({token: process.env.SITE_TOKEN}, process.env.JWT_SECRET)
    }
    // api error message formatter
    createAPIErrorMessage(status, err, message, form) {
        var result = {
            server: {
                status: status
            },
            data: {
                error: err,
                message: message
            },
            formResponse: form
        }

        return result
    }
}
module.exports.Utilities = Utilities
