const redis = require('redis');
const client = redis.createClient();

exports.handle = () => {
	client.incr('counter')
	console.log('okokokokko')
}
