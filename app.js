const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DbConnection = require('./app/config/db-connection');
const checkUserLogin = require('./app/middleware/check-user-login');
const flash = require('connect-flash');

const app = express();
const port = process.env.PORT || 3000;
const conn = new DbConnection();

/* router */
const home = require('./app/routes/home')
const loginRouter = require('./app/routes/login');
const userRouter = require('./app/routes/user');
const register = require('./app/routes/register')

// CONNESSIONE AL DATABASE
conn.on('dbConnection', conn => {
    app.listen(port, () => console.log(`Server in ascolto sulla porta ${port}`));
});
conn.getConnection();


// DEFINIZIONE DEL TEMPLATE ENGINE
app.set('views', './app/views');
app.set('view engine', 'ejs');

// FILE STATICI
app.use('/public', express.static(__dirname + '/public'));

app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'chiaveSegreta123',
    saveUninitialized: false,
    resave: false
}));

// ROTTA RADICE
app.use(home)

// FUNZIONE PER IL LOGIN
app.use(passport.initialize());
app.use(passport.session());
app.use(loginRouter);
app.use('/user', checkUserLogin(), userRouter);

// FUNZIONI PER LA REGISTRAZIONE
app.use(register)