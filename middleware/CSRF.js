const app = require('express')();
const crypto = require('crypto');

exports.generate = () => {
	const token = crypto.randomeByte(20).toString('hex');

};

exports.verify = (request, response, next) => {
	const token = request.session.token;
	const token_input = request.body.token;

	return token === token_input;
}