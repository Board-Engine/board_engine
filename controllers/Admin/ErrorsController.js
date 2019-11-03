const ErrorCaught = require('../../models/ErrorCaught');

exports.index = async (request, response) => {
    const tab = 'errors';

    const limit = 50;

    let errors = await ErrorCaught.paginate({}, limit);

    if (request.query.page) {
        const page = request.query.page;
        errors = await ErrorCaught.paginate({}, { limit, page })
    }

    response.render('admin/errors/index.html', {
        tab,
        errors
    });
};

exports.show = (request, response) => {

};

exports.destroy = (request, response) => {

};