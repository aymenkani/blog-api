const multer = require('multer');
const { v4: uuidv4 } = require('uuid')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'private/ebooks')
    },
    filename: function (req, file, cb) {
        const fileName = uuidv4() + '_' + file.originalname.replace(/\//g, '_') // only for windows
        cb(null, fileName)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype !== 'application/pdf') {
        return cb(null, false)
    }

    cb(null, true)
}

module.exports = multer({ storage, fileFilter }).single('ebook')