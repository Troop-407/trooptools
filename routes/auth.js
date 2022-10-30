const express = require('express')
const router = express.Router();
const {User} = require('../models/user')
const {Utilities} = require('../utilities/utilities')
const {verifyInternalRequest} = require('../auth/verify')
// create route to login page
router.get('/join', (req, res) => {
    res.render('./login/join.ejs', {
        errorMessage: null
    })
})
router.get('/docs/privacy', (req, res) => {
    // privacy policy 
})
router.get('/login', (req, res) => {
    res.render('./login/auth-login.ejs', {
        errorMessage: null,
        formData: null
    })
})
router.get('/register', (req, res) => {
    res.render('./login/register.ejs', {
        errorMessage: null,
        formData: null
    })
})
// create route for form request
// TODO: authenticate these routes with JWT to only allow requests from the server
router.post('/register', verifyInternalRequest, (req, res) => {
    const object = {
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "username": req.body.username,
        "email": req.body.email,
        "password": req.body.password,
    }

    const user = new User()
    // registers name and gets the returned message for error handeling (if there is an error)
    user.register(object, req, res, true)
})
router.post('/login', verifyInternalRequest, async (req, res) => {
    const object = {
        "email": req.body.email,
        "password": req.body.password,
    }

    const user = new User()
    const userResponse = await user.login(object, req, res, true)
})

module.exports = router