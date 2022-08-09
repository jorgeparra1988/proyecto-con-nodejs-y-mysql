var express = require('express');
var router = express.Router();
var passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('index');
});

router.get('/signup',isNotLoggedIn, (req, res, next) =>  {
  res.render('auth/signup');
});

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));


router.get('/signin',isNotLoggedIn,(req, res, next) =>{
  res.render('auth/signin');
});

router.post('/signin',isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local.signin',{
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
  })(req, res, next);
});


router.get('/profile', isLoggedIn, (req, res, next) => {
  res.render('profile');
});

router.get('/logout',isLoggedIn, (req, res, next)=> {
  req.logOut();
  res.redirect('/signin');
});







module.exports = router;
