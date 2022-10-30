const express = require('express')
const router = express.Router()
const { verify } = require('../../../auth/verify')
// routers for all logged in members pages

router.get('/greetings', verify, (req, res) => {
    // send "welcome, <username>"
    // res.send(`welcome ${username}`)
    res.render('./member/welcome/welcome.ejs')
    // TODO
    // get username with a function
    //  convert JWT to username
})

module.exports = router