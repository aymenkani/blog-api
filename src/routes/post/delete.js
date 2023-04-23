const express = require('express');
const BadRequestError = require('../../common/errors/bad-request-error');
const NotAuthorizedError = require('../../common/errors/not-authorized-error');
const NotFoundError = require('../../common/errors/not-found-error');

const Post = require('../../models/post')

const router = express.Router();

router.delete('/delete/:id', async (req, res, next) => {
    const { id } = req.params;

    if(!id) {
        return next(new BadRequestError('post id is required'));
    }

    try {

        const post = await Post.findById(id)
        if(!post) throw new NotFoundError('Document not found')// document not found

        const { deletedCount } = await Post.deleteOne({ _id: id, user: req.currentUser.userId }) // findOneAndDelete({ _id: id })
        if(deletedCount === 0) {
            throw new NotAuthorizedError();
        }

        return res.status(200).json({ success: true })
    } catch(err) {
        return next(err)
    }
})

module.exports = router;