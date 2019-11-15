const redis = require('redis');
const client = redis.createClient();

module.exports = (request, response, next) => {
	client.incr('counter');
	next();
};