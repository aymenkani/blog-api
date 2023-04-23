const CustomError = require('./custom-error')

module.exports = class NotAuthorizedError extends CustomError {
    constructor() {
        super('not authorized')
        this.statusCode = 401
    }

    generateErrors() {
        return [{ message: 'not authorized' }]
    }
}
