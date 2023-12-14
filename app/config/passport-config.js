const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy
const DB = require('./db-connection');
const bcrypt = require('bcrypt');
const { ObjectID } = require('mongodb');


// STRATEGIA PER IL LOGIN CON GOOGLE
passport.use(new GoogleStrategy(
    {
        clientID: '689670408855-ood1e773s2on2bf2105ckm5lgv0oavt3.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: '/google-auth-redirect',
        responseType: 'code'
    }, async (accessToken, refreshToken, tokenID, done) => {
        let user = await DB.userCollection.findOne({ googleID: tokenID.id })
        if (!user) {
            const newUser = {
                googleID: tokenID.id,
                username: tokenID.username,
                email: tokenID.emails[0].value
            }

            const ris = DB.userCollection.insertOne(newUser)
            console.log(ris)
        }

        return done(null, user)
    }
))

// STRATEGIA PER IL LOGIN CON LE CREDENZIALI
passport.use(
    'local-login',
    new LocalStrategy(
        { passReqToCallback: true },
        async (req, username, password, done) => {
            const user = await DB.userCollection.findOne({ username: username });
            if (!user || !bcrypt.compareSync(password, user.password)) {
                return done(null, false, { message: req.flash('loginFallito', 'I dati non sono corretti!') });
            }
            return done(null, user);
        })
);

// SERIALIZZAZIONE DELL'UTENTE
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// DESERIALIZZAZIONE DELL'UTENTE
passport.deserializeUser(async (id, done) => {
    // Recupero dell'utente nel database
    const user = await DB.userCollection.findOne({ _id: ObjectID(id) });
    done(null, user);
});

module.exports = passport;