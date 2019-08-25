const express = require('express');
const app = express();
const port = 8080;
const nunjucks = require('nunjucks');

nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch: true
});

const router = require('./routes/web');

app.use('/', router)

app.listen(port);