const jwt = require('jsonwebtoken')

module.exports.verify = function(req, res, next) {
    const token = req.header('auth-token') || req.cookies.auth_token
    if(!token) return res.status(401).send("Access Denied")
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verified
        next()
    } catch(error) {
        res.send(error)
    }   
}
// this function simply checks that if a request contains a cookie then it is 
// coming from the website otherwise it is assumed it is coming from an external source
module.exports.verifyInternalRequest = function(req, res, next) {
    const token = req.cookies.web_token
    if(!token) return res.status(401).send("Access Denied")
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        console.log("success")
        next()
    } catch(error) {
        console.log("access from server denied")
        res.send(error)
    }   
}