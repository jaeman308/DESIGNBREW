const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

const multer = require('multer');
const upload = multer({dest: 'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype) && (file.fieldname === 'image'|| file.fieldname === 'profilePicture')) {
            cb(null, true);
        } else {
            cb(new multer.MulterError('Unexpected field or file type'), false);
        }
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await User.find({}).populate('boards'); 
        res.render('allusers/index.ejs', { users }); 
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('boards');
        res.render('allusers/show.ejs', { user, boards: user.boards }); 
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});


module.exports = router;