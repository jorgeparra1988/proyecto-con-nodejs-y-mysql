var express = require('express');
var router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, function(req, res, next) {
    res.render('links/add');
});

router.post('/add', isLoggedIn, async (req, res, next) => {
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description
    };
    await pool.query('INSERT INTO links set ?', [newLink]);
    req.flash('success', 'Link guardado correctamente');
    res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res, next) => {
    const links = await pool.query('SELECT * FROM links');
    res.render('links/list', {links});
});

router.get('/delete/:id', isLoggedIn, async (req, res, next) => {
    const { id } = req.params;
    await pool.query('DELETE FROM LINKS WHERE ID = ?', [id]);
    req.flash('success','Link borrado correctamente');
    res.redirect('/links');
});

router.get('/edit/:id', isLoggedIn, async (req, res, next) => {
    const { id } = req.params;
    const links = await pool.query('SELECT *  FROM links WHERE id = ?', [id]);
    res.render('links/edit', {link: links[0]});
});

router.post('/edit/:id', async (req, res, next) => {
    const {id} = req.params;
    const {title, description, url } = req.body;
    const newLink = {
        title,
        url,
        description
    };
    await pool.query('UPDATE links set ? WHERE id = ?',[newLink,id]);
    req.flash('success','Link actualizado satisfactoriamente');
    res.redirect('/links');
});

module.exports = router;