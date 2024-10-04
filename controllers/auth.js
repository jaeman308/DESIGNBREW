const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const multer = require('multer')
const upload= multer({ dest:'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'profilePicture') {
            cb(null, true); 
        } else {
            cb(new multer.MulterError('Unexpected field'), false);
        }
    }});


router.get('/sign-up', (req, res)=> {
    res.render('auth/sign-up.ejs');
});

router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs');
});

router.get('/sign-out', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

router.post('/sign-up', upload.single('profilePicture'), async (req, res) => {
    try {
        console.log('File:', req.file);
        console.log('Body:', req.body);
        const userInDatabase = await User.findOne({ username: req.body.username });
        if (userInDatabase) {
            return res.send('Username already taken.');
        }
        const emailInDatabase = await User.findOne({email: req.body.email});
        if(emailInDatabase) {
            return res.send('Account associated with email already.')
        }
        if (req.body.password !== req.body.confirmPassword){
            return res.send('Passwords dont match.');
        }
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        req.body.password = hashedPassword;
        const userData = {
            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            profilePicture: req.file ? req.file.path: null,
        };

        await User.create(userData);

        res.redirect('/auth/sign-in');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }

});

router.post('/sign-in', async (req,res) => {
    try {
        const userInDatabase = await User.findOne({ username: req.body.username });
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