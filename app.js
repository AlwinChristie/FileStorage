var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./controllers/index');
var usersRouter = require('./controllers/users');
const files = require('./controllers/files');
const auth = require('./controllers/auth');

const passport = require('passport');
const session = require('express-session');

var app = express();

// db conn using .env file
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}

// passport config for auth
app.use(session({
  secret: process.env.PASSPORT_SECRET,
  resave: true,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const User = require('./models/user');
passport.use(User.createStrategy())

// let passport read/write user data to/from session vars
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// google auth config
const google = require('passport-google-oauth20').Strategy
passport.use(new google({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
  (accessToken, refreshToken, profile, done) => {
    User.findOrCreate({ oauthId: profile.id }, {
      username: profile.displayName,
      oauthProvider: 'Google',
      created: Date.now()
    }, (err, user) => {
      return done(err, user)
    })
  }
))

// Connect to MongoDB database
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL)
.then((res) =>{
  console.log('Connected to database');
  }
).catch((err) => {
  console.log(`Database connection error: ${err}`);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/files', files);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
