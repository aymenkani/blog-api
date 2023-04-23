const express = require('express');
const BadRequestError = require('../../common/errors/bad-request-error');
const NotAuthorizedError = require('../../common/errors/not-authorized-error');
const NotFoundError = require('../../common/errors/not-found-error');

const Comment = require('../../models/comment')

const router = express.Router()

router.delete('/delete/:commentId', async (req, res, next) => {
    const { commentId } = req.params;

    if(!commentId) {
        return next(new BadRequestError('comment id is required'))
    }

    try {
        const comment = await Comment.findById(commentId);
        if(!comment) throw new NotFoundError('Document not found')
        
        const { deletedCount } = await Comment.deleteOne({ _id: commentId, user: req.currentUser.userId })
        
        if(deletedCount === 0) {
            throw new NotAuthorizedError()
        }

        return res.status(200).json({ success: true })
    } catch(err) {
        return next(err)
    }
})

module.exports = router