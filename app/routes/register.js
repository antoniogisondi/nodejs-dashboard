const express = require('express');
const bcrypt = require('bcrypt')
const passport = require('passport')
const DB = require('../config/db-connection')
const router = express.Router();

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body
        const existingUser = await DB.userCollection.findOne({ username: username })
        if (existingUser) {
            res.redirect('login')
        }
        const hashed_pwd = bcrypt.hashSync(password, 10)
        const newUser = {
            username: username,
            email: email,
            password: hashed_pwd
        }

        await DB.userCollection.insertOne(newUser)
        res.json({ message: req.flash('success', 'Hai effettuato la registrazione con successo') }).redirect('/user/dashboard')

        req.login(newUser, (err) => {
            if (err) {
                return res.status(500).json({ message: req.flash('Errore durante l\'autenticazione dopo la registrazione') });
            }

            return res.status(201).json({ message: req.flash('Utente registrato e autenticato con successo') });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante la registrazione' });
    }

})

module.exports = router