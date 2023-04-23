const express = require('express');
const Ebook = require('../../models/ebook')

const route = express.Router();

route.get('/all', async (req, res, next) => {
    try {
        const ebooks = await Ebook.find();

        return res.status(200).json({ ebooks })
    } catch (err) {
        next(err)
    }
})

route.get('/:ebookId', async (req, res, next) => {
    try {
        const ebook = await Ebook.findById(req.params.ebookId);

        return res.status(200).json({ ebook })
    } catch (err) {
        next(err)
    }
})

module.exports = route
