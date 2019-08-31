const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const sessionStore = new session.MemoryStore;


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/board', { useNewUrlParser: true });

const port = 8080;

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 60000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));
app.use(flash());

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