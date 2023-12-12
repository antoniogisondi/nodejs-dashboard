const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const DB = require('./db-connection');
const { ObjectID } = require('mongodb');

passport.use(
    'local-login', 
    new LocalStrategy(
        { passReqToCallback: true },
        async (req, username, password, done) => {
        const user = await DB.userCollection.findOne({ username: username });
        if(!user || user.password !== password) {
            return done(null, false, { message: req.flash('loginFallito', 'I dati non sono corretti!') });
        }
        return done(null,user);
    })
);

passport.serializeUser((user,done) => {
    done(null,user._id);
});

passport.deserializeUser(async (id,done) => {
    // Recupero dell'utente nel database
    const user = await DB.userCollection.findOne({ _id: ObjectID(id) });
    done(null,user);
});

module.exports = passport;