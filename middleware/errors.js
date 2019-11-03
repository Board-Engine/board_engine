const ErrorCaught = require('../models/ErrorCaught');

module.exports = async (error, request, response, next) => {
    if (error) {
        const data = {
            title: error,
            page: request.originalUrl,
            ip: request.ip
        };

        await ErrorCaught.create(data);


        return response.redirect('/error');
    }
    console.log('test')
    next()
};