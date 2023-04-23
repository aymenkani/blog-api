const express = require('express')
const User = require('../../models/user')

const route = express.Router()

route.get('/current-user', async (req, res, next) => {

    try {
        const user = await User.findById(req.currentUser.userId).select('-password');

        res.status(200).json({ user })

    } catch (err) {
        next(err)
    }
})

module.exports = route