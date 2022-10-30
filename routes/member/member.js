const express = require('express')
const router = express.Router()
// routers for all logged in members pages
const welcomeRouter = require('./welcome/welcome.router')

// use router middleware 
router.use(welcomeRouter)

module.exports = router