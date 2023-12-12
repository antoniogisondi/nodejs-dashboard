const express = require('express');
const router = express.Router();

router.get('/dashboard', (req,res) => {
    const html = `Ciao ${req.user.username}<a href='/logout'>Effettua il logout</a>`;
    res.send(html);
});

router.get('/dashboard-2', (req, res) => {
    const html = `<h3><a href='/logout'>Effettua il logout</a></h3>`;
    res.send(html);
});

module.exports = router;