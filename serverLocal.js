// PatymLabs Challenge - Weather App using Openweather API
// Author: Sneha Shirsat

// All necessary imports for express, handlebars, passport, cookies and session
// imports for mongoDB connection
var express  = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var request = require('request')
var http = require('http')
var path = require('path')
var exphbs = require('express-handlebars')
var expressValidator = require('express-validator')
var flash = require('connect-flash')
var routes = require('./routes/index')
var users = require('./routes/users')
var engines = require('consolidate')
var session = require('express-session')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

// for database connection, mongodb
var mongo = require('mongodb');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/SneDatabase');
var db = mongoose.connection;

//instance of express is the app
var app = express();

// set view engines//
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');
//app.engine('ejs', engines.ejs);

// use body parser and cookie parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser());

// express won't allow the use of css unless we expose it.
app.use(express.static(path.join(__dirname, '/public')))

// express session
app.use(session({
    secret:'secret',
    saveUninitialized:true,
    resave:true
}));

// use passport and initialize session
app.use(passport.initialize());
app.use(passport.session());


// express validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// use connect flash for error message
app.use(flash());

// Global Vars, check these for error messages to be displayed on UI
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

const apiKey = '761e5114583f1460afc0fdd1360887ed';

// using routes
app.use('/', routes);
app.use('/users', users);

app.listen(4433, function(){

	console.log('example app listening on port 4433')

})
