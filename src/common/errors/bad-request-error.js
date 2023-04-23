const CustomError = require('./custom-error');

module.exports = class BadRequestError extends CustomError {
    constructor(customMessage) {
        super(customMessage);

        this.statusCode = 400;
        this.customMessage = customMessage
    }

    generateErrors() {
        return [{ message: this.customMessage }]
    }
}