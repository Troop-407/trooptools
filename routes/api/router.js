const router = require('express').Router()
// import individual routers
const roles = require('./roles')
const user = require('./users')

// set middlewares 
router.use('/api/roles/', roles)
router.use('/api/user/', user)

module.exports = router