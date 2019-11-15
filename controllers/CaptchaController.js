const Session = require('../models/Session');
const svgCaptcha = require('svg-captcha');

exports.captcha = async (request, response) => {
    const captcha = svgCaptcha.create({
        color: true,
        background: '#a8a8a8',
        size: 7,
        width: 300,
        height: 100,
    });

    const captcha_text = captcha.text;

    request.session.captcha = captcha.text;
    request.session.save(() => {
        console.log('saved');
        console.log(request.session.captcha);
        response.type('svg');
        response.status(200).send(captcha.data);
    })
};

exports.postCaptchaConfirm = async (request, response) => {
    const sessions = await Session.find();
    if (! sessions.length) {
        console.log('sessions empty');
        return response.status(202).send(false)
    }

    const captcha_input = await request.body.captcha;

    for (session of sessions) {
        let cookie = await session.session;
        cookie = await JSON.parse(cookie);
        const captcha = await cookie.captcha;

        if (captcha_input === captcha) {
            console.log('captcha is validated SUCCESSFULLY');
            return response.status(202).send(true);
        }
    }

    return response.status(202).send(false);
};