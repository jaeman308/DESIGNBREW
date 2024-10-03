const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user.js');


router.get('/sign-up', (req, res)=> {
    res.render('auth/sign-up.ejs');
});

router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs');
});

router.get('/sign-out', (req, res) => {
    req.session.destory();
    res.redirect('/');
});

router.post('/sign-up', async (req, res) => {
    try {
        const userInDatabase = await User.findOne({username: req.body.username });
        if (userInDatabase) {
            return res.send('Username already taken.');
        }

        if (req.body.password !== req.body.confirmPassword){
            return res.send('Passwords dont match.');
        }
        const hashPassword = bcrypt.hashSync(req.body.password, 10);
        await User.creat(req.body);

        res.redirect('/auth/sig-in');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.post('/sig-in', async (req,res) => {
    try {
        const userInDatabase = await User.findOne({username: req.body.username });
        if (!userInDatabase) {
            return res.send('login failed. Please try again.');
        };
        const validPassword = bcrypt.compareSync (
            req.body.password,
            userInDatabase.password
        );
        if (!validPassword){
            return res.send('Lgoin falided. Please try again.')
        };
        req.session.user = {
            username: userInDatabase.username,
            _id: userInDatabase._id
        };
        res.redirect('/');
    }catch (error) {
        console.log(error);
        res.redirect('/');
    };

});

module.exports = router;