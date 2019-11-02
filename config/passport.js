const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');
const argon2 = require('argon2');

module.exports = (passport) => {
    passport.use(new LocalStrategy(async (username, password, done) => {
        const user = await User.findOne({name: username});
        if (! user) {
            return done(null, false, { message: 'user incorrect' });
        }
        if (await argon2.verify(user.password, password)) {
            return done(null, user);
        }
        else {
            return done(null, false, { message: 'Password incorrect' });
        }
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};


