exports.getLogin = (request, response) => {
    return response.render('front/login.html')
};
/*
exports.postLogin = passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
})
 */