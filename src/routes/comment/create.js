const express = require('express');

const Comment = require('../../models/comment')

const router = express.Router()

router.post('/:postId/create', async (req, res, next) => {
    const { postId } = req.params;
    const { content } = req.body;

    if(!postId || !content) {
        return next(new BadRequestError('Invalid data'));;
    }

    try {
        const comment = new Comment({ user: req.currentUser.userId, content, post: postId });
        await comment.save();

        return res.status(200).json({ comment })
    } catch (err) {
        return next(err)
    }
})

module.exports = router
