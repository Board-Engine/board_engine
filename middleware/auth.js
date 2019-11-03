module.exports = (request, response, next) => {
    if (request.isAuthenticated()) {
        next();
    }
    else {
        request.flash('error_msg', 'Please log in to view that resource');
        response.redirect('/login');
    }
}