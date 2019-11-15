const svgCaptcha = require('svg-captcha');
const redis = require('redis');
let client = redis.createClient();
const {promisify} = require('util');
const getAsync = promisify(client.get).bind(client);
const keysAsync = promisify(client.keys).bind(client);

exports.captcha = async (request, response) => {
    const captcha = svgCaptcha.create({
        color: true,
        background: '#a8a8a8',
        size: 7,
        width: 300,
        height: 100,
    });

    //request.session.captcha = captcha.text;
    let session_id = await request.sessionID;
    session_id = `captcha:${session_id}`;
    await client.set(session_id, captcha.text);
    await client.expire(session_id, 1000)
    await response.type('svg');
    await response.status(200).send(captcha.data);
};

exports.postCaptchaConfirm = async (request, response) => {

    let session_id = await request.sessionID;
    session_id = `captcha:${session_id}`;

    const captcha_input = await request.body.captcha;

    const captcha_stored = await getAsync(session_id);

    if (captcha_input === captcha_stored) {
        return response.status(202).send(true);
    }

    return response.status(202).send(false);
};