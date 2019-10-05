exports.index = (request, response) => {
    const tab = 'home';
    response.render('admin/index.html', {
        tab
    })
};