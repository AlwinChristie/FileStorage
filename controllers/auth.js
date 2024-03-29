var express = require('express');
var router = express.Router();
const passport = require('passport');
const User = require('../models/user');

// GET: /auth/register => show register form
router.get('/register', (req, res) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
    });
    res.render('auth/register', { title: 'User Registration' });
});

// POST: /auth/register => create new user and redirect to /files
router.post('/register', (req, res) => {
    User.register(new User({ username: req.body.username }), req.body.password, (err, user) =>{
        if (err) {
            console.log(err);
            res.render('auth/register', { title: 'User Registration', messages: "User Already Exists"});
        }
        else {
            req.login(user, (err) => {
                res.redirect('/files')
            })
        }
    })
})


// GET: /auth/login => show login form
router.get('/login', (req, res) => {
     
    // if there are any session messages, store them in a local var
    let messages = req.session.messages || []
    // clear the session error messages
    req.session.messages = []
    
    req.logout((err) => {
        if(err) {
            return next(err);
        }
    });  

    res.render('auth/login', { title: 'Login', messages: messages });
});

// POST: /auth/login => use passport to do auth check
router.post('/login', passport.authenticate('local', {
    successRedirect: '/files',
    failureRedirect: '/auth/login',
    failureMessage: 'Invalid Login Credentials'
}))

// GET: /auth/logout 
router.get('/logout', (req, res, next) => {
    req.session.messages = []
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        res.redirect('/auth/login');
    })
})

// GET: auth/google => invoke Google sign in attempt
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}), (req, res) => {}
)

// GET: /auth/google/callback => handle return of user from google
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/auth/login'
}), (req, res) => {
    res.redirect('/files')
})

module.exports = router;