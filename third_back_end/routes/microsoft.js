var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET auth callback. */
router.get('/signin',
  function  (req, res, next) {
    console.log(res);
    passport.authenticate('azuread-openidconnect',
      {
        response: res,
        prompt: 'login',
        failureRedirect: '/',
        failureFlash: true,
        successRedirect: '/'
      }
    )(req,res,next);
  }
);

// <CallbackRouteSnippet>
router.post('/callback',
  function(req, res, next) {
    console.log(req);
    passport.authenticate('azuread-openidconnect',
      {
        response: res,
        failureRedirect: '/',
        failureFlash: true
      }
    )(req,res,next);
  },
  function(req, res) {
    // TEMPORARY!
    // Flash the access token for testing purposes
    console.log(req.user.accessToken);
    req.flash('error_msg', {message: 'Access token', debug: req.user.accessToken});
    res.redirect('/');
  }
); 

module.exports = router;