// testing private routes
const express = require('express')
const router = express.Router();
const { verify } = require('../auth/verify')
router.get('/', verify, (req, res) => {
    const obj = {
        "post": {
            "post_id": 1,
            "author": "Austin Wahl",
            "content": "Some content in this post"
        }
    }
    res.send(obj)
})
module.exports = router