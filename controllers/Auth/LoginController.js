const User = require('../../models/User');
const crypto = require('crypto');
const argon2 = require('argon2');


exports.getLogin = (request, response) => {
    return response.render('front/login.html')
};

exports.postLogin = async (request, response) => {

    const name = await request.body.name;
    let password = await request.body.password;

    const user = await User.findOne({name});
    if (! user) {
        return response.json('nope')
    }

    if (! await argon2.verify(user.password, password)) {
        return response.json('nope')
    }
    else {
        const token = await crypto.randomBytes(128).toString('hex');
        request.session.token = token;

        return await response.json(token)
    }
};