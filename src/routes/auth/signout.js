const express = require('express');

const route = express.Router();

route.post('/signout', async (req, res, next) => {
    req.session = null;
    res.send({})
})

module.exports = route