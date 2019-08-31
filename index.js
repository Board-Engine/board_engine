const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const port = 8080;

app.use(bodyParser.urlencoded({
    extended: true
}));

const nunjucks = require('nunjucks');

nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch: true
});


const router = require('./routes/web');

router.use(bodyParser.json())

app.use('/', router)

app.listen(port);