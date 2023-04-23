const express = require('express');
const BadRequestError = require('../../common/errors/bad-request-error');
const NotAuthorizedError = require('../../common/errors/not-authorized-error');
const NotFoundError = require('../../common/errors/not-found-error');

const Comment = require('../../models/comment')

const router = express.Router()

router.post('/update/:commentId', async (req, res, next) => {
    const { commentId } = req.params;

    const { content } = req.body

    if(!commentId || !content) {
        return next(new BadRequestError('comment id is required'))
    }

    try {
        const comment = await Comment.findById(commentId)
        if(!comment) throw new NotFoundError('Document not found')

        const { modifiedCount } = await Comment.updateOne(
            { _id: commentId, user: req.currentUser.userId }, 
            { content })

        if(modifiedCount === 0) {
            throw new NotAuthorizedError()
        }

    } catch(err) {
        return next(err)
    }
})

module.exports = router