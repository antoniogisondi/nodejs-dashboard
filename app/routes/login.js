const express = require('express');
const router = express.Router();
const passport = require('../config/passport-config');

// ROTTE PER IL LOGIN GET E POST
router.get('/login', (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/user/dashboard');
    res.render('login', { message: req.flash('loginFallito') });
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/user/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}));

// ROTTE PER IL LOGIN CON GOOGLE
router.get('/google-auth', passport.authenticate('google', {
    scope: ['openid', 'email']
}))

router.get('/google-auth-redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('/user/dashboard')
})

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: req.flash('errore-logout', 'Errore durante il logout') })
        }
    });
    res.redirect('/');
});

module.exports = router;