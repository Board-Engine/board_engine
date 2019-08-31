const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const port = 8080;

app.use(bodyParser.json())

const nunjucks = require('nunjucks');

nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch: true
});

const router = require('./routes/web');

app.use('/', router)

app.listen(port);