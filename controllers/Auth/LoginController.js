exports.getLogin = (request, response) => {
    console.log(`before login: ${request.isAuthenticated()}`)
    return response.render('front/login.html')
};
/*
exports.postLogin = passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
})
 */