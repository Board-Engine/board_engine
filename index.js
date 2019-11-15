const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const sessionStore = new session.MemoryStore;
const config = require('./env');
const redis = require('redis');

let RedisStore = require('connect-redis')(session);
let client = redis.createClient();

const port = config.app.port;

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());
app.use(cookieParser('toto'));
/*
app.use(session({
    cookie: { 
    	maxAge: 15 * 60 * 1000 ,
    	//secure: true,
    	httpOnly: true,
        secure: false
    },
    saveUninitialized: true,
    store: new MongoStore({
        url: `mongodb://localhost/${config.db.name}`,
        collection: 'sessions'
    }),
    secret: 'toto',
    resave: false,

}));

 */


app.use(session({
    secret: 'toto',
    // create new redis store.
    store: new RedisStore({ host: 'localhost', port: 6379, client: client,ttl :  260}),
    saveUninitialized: false,
    resave: false
}));

app.use(flash());

const nunjucks = require('nunjucks');

nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch: true
});

const router = require('./routes/web');

router.use(bodyParser.json());

const admin_router = require('./routes/admin');

app.use('/', router)
app.use('/admin', admin_router)

app.listen(port);