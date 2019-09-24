const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const sessionStore = new session.MemoryStore;
const config = require('./env');
const redis = require('redis');

let RedisStore = require('connect-redis')(session)
let client = redis.createClient()

const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost/${config.db.name}`, { useNewUrlParser: true });

const port = config.app.port;

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cookieParser('toto'));
app.use(session({
    cookie: { 
    	maxAge: 60000 ,
    	secure: true,
    	httpOnly: true,
    },
    saveUninitialized: true,
    store: new RedisStore({ client }),
    secret: 'toto',
    resave: false,

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