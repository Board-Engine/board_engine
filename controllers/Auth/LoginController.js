const User = require('../../models/User');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy((name, password, done) => {
    User.findOne({ name }, (error, user) => {
        if (error) {
            return done(error)
        }
        if (! user) {
            return done(null, false);
        }
        if (! user.verifyPassword(password)) {
            return done(null, false);
        }
        return done(null, user);
    })
}));

exports.getLogin = (request, response) => {
    return response.render('front/login.html')
};

exports.postLogin = async (request, response) => {

    const name = request.body.name;
    let password = request.body.password;

    const user = await User.findOne({name})
    if (! user) {
        return response.json('nope')
    }
    bcrypt.compare(password, user.password, (err, res) => {
        if (! res) {
            response.json('nope')
        }
        else if (res) {
            request.session.isLogged = true

            response.json('ok')
        }
    })
};