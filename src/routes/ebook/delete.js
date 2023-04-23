const express = require('express');
const Ebook = require('../../models/ebook')
const BadRequestError = require('../../common/errors/bad-request-error')
const NotAuthorizedError = require('../../common/errors/not-authorized-error')
const User = require('../../models/user')
const fs = require('fs')

const route = express.Router();

route.delete('/delete/:ebookId', async (req, res, next) => {
    try {
        const ebook = await Ebook.findById(req.params.ebookId);
        if(!ebook) throw new BadRequestError('Document Not found!')

        const { deletedCount } = await Ebook.deleteOne({ _id: req.params.ebookId, user: req.currentUser.userId })
    
        if(deletedCount === 0) throw new NotAuthorizedError();

        await User.findOneAndUpdate({ _id: req.currentUser.userId }, 
            { $pull: { ebooks: req.params.ebookId } })

        fs.unlink('private/ebooks/'+ebook.filename, (err) => {
            if(err) throw err
        })

        return res.status(200).json({ success: true })

    } catch(err) {
        next(err)
    }
})

module.exports = route
