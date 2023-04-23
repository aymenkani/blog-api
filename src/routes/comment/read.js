const express = require('express');
const BadRequestError = require('../../common/errors/bad-request-error');
const NotFoundError = require('../../common/errors/not-found-error');

const Comment = require('../../models/comment')

const router = express.Router()

router.get('/all/:postId', async (req, res, next) => {
    const { postId } = req.params;

    if(!postId) {
        return next(new BadRequestError('post id is required'))
    }

    try {
        const comments = await Comment.find({ post: postId });
        return res.status(200).json({ comments })
    } catch (err) {
        return next(err)
    } 
})

router.get('/:commentId', async (req, res, next) => {
    const { commentId } = req.params;

    if(!commentId) {
        return next(new BadRequestError('comment id is required'));
    }

    try {
        const comment = await Comment.findById(commentId).populate('post');
        if(!comment) throw new NotFoundError('Document not found')
        return res.status(200).json({ comment });
    } catch (err) {
        return next(err)
    }
})

module.exports = router