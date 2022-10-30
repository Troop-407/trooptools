const express = require('express')
const router = express.Router()
const {verifyInternalRequest} = require('../../auth/verify')
// import roles class
const Roles = require('../../models/roles')
// routes
router.get('/fetch/:troop_id', async (req, res) => {
    const roles = new Roles
    roles.getRoles(req.params.troop_id, res)
})
router.post('/create', async (req, res) => {
    const roles = new Roles
    const role = {
        role_name: req.body.role_name,
        role_value: req.body.role_value,
        troop_id: req.body.troop_id,
        color: req.body.color || "#fefefe"
    }
    roles.createRole(role, res)
})
router.post('/update', async (req, res) => {
    const roles = new Roles
    const role = {
        role_id: req.body.role_id,
        role_name: req.body.role_name,
        role_value: req.body.role_value,
        troop_id: req.body.troop_id,
        color: req.body.color || "#fefefe"
    }
    roles.createRole(role, res)
})

module.exports = router