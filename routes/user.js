const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken')
const joi = require('joi')
const connection = require('../server/connection')
const {User} = require('../models/user')
// POST routes
router.post('/register', async (req, res) => {
    const object = {
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "username": req.body.username,
        "email": req.body.email,
        "password": req.body.password,
    }
    const user = new User()
    user.register(object, req, res)
})
router.post('/login', (req, res) => {
    const object = {
        "email": req.body.email,
        "password": req.body.password,
    }
    const user = new User()
    user.login(object, req, res)
})

module.exports = router