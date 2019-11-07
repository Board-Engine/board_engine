const crypto = require('crypto');

// TODO SHA256 IP
module.exports = (request, response, next) => {
    const ip = request.ip
    console.log(ip)

    next()
};