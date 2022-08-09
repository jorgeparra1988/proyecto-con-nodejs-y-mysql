var express = require('express');
var path = require('path');
//var cookieParser = require('cookie-parser');
var logger = require('morgan');
//estos los agrego yo
const {engine} = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const smysql = require('express-mysql-session');
const passport = require('passport');

const { database } = require('./views/keys');


var indexRouter = require('./routes/index');
//estos los agrego yo
var authenticationRouter = require('./routes/authentication');
var linksRouter = require('./routes/links');



var app = express();
require('./lib/passport');

app.set('views', path.join(__dirname, 'views'));
//estos los agrego yo
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir:path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers:require('./lib/handlebars')
}));

app.set('view engine','.hbs');

app.use(session({
    secret:'sesionjorge',
    resave:false,
    saveUninitialized: false,
    store: new smysql(database)
}));

app.use(flash());
//hasta aqui
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

//estos los agrego yo
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

app.use('/', indexRouter);

app.use('/authentication', authenticationRouter);
app.use('/links', linksRouter);






module.exports = app;
