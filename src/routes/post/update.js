const express = require('express');
const BadRequestError = require('../../common/errors/bad-request-error');
const NotFoundError = require('../../common/errors/not-found-error');
const Post = require('../../models/post')

const router = express.Router();

router.post('/update/:id', async (req, res, next) => {
    const { id } = req.params
    const { title, content, excerpt } = req.body;

    if((!title && !content && !excerpt) || !id) {

        return next(new BadRequestError('bad request'));
    }

    try {
        const post = await Post.findOneAndUpdate({ _id: id, user: req.currentUser.userId }, {
            title, content, excerpt
        }, { new: true })
        
        if(!post) {
            throw new NotFoundError('Document not found')
        }

        return res.status(200).json({ post })
    } catch(err) {
        return next(err)
    }
})

module.exports = router;