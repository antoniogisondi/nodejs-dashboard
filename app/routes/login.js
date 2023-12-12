const express = require('express');
const router = express.Router();
const passport = require('../config/passport-config');

router.get('/login', (req,res) => { 
    if(req.isAuthenticated()) return res.redirect('/user/dashboard');  
    res.render('login', { message: req.flash('loginFallito') });
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/user/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/logout', (req,res) => {
    req.logout();
    res.redirect('/login');
});

module.exports = router;