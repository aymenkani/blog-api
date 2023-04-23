const { validationResult } = require('express-validator');
const RequestValidationError = require('../errors/request-validation-error');

module.exports = (req, res , next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return next(new RequestValidationError(errors.array()));
    }

    next()
}