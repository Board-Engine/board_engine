const crypto = require('crypto');

// TODO SHA256 IP
module.exports = (request, response, next) => {
    const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    const hash = crypto.createHash('sha256').update(ip).digest('hex');

    next();
};