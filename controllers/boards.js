const express = require('express');
const router = express.Router();
const User = require('../models/user.js')
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

router.get('/:userId/boards', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.render('boards/index.ejs', {
            boards: user.boards,
            userName: user.name,
            userId: user._id,
            profilePicture: user.profilePicture
            
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.get('/:userId/boards/new', async (req, res) => { 
    try {
        const user = await User.findById(req.params.userId);
        res.render('boards/new.ejs', {
        userId: user._id,
     });
    } catch (error) {
        console.log(error);
        res.redirect("/")
    }
});

router.get('/:userId/boards/:boardId/edit', async (req,res) => {
    try{
        const currentUser = await User.findById(req.params.userId);
        const boardItem = currentUser.boards.id(req.params.boardId);
        res.render('boards/edit.ejs',{
            board: boardItem,
            userId: currentUser._id
        });
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

router.put('/:userId/boards/:boardId', upload.single('image'), async (req, res) => {
    try{
        const currentUser = await User.findById(req.params.userId);
        const boardItem = currentUser.boards.id(req.params.boardId);

        boardItem.room = req.body.room;
        boardItem.category = req.body.category;

        if (req.file) {
            boardItem.image = req.file.filename;
        }
        boardItem.description = req.body.description;

        await currentUser.save();
        res.redirect(`/users/${currentUser._id}/boards/`);

    } catch (error) {
        console.log(error);
        res.redirect('/');
}
});

router.post('/:userId/boards', upload.single('image'), async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        const newBoardItem = {
            room: req.body.room,
            category: req.body.category,
            image: req.file ? req.file.filename : null,
            description: req.body.description,
        };
        currentUser.boards.push(newBoardItem);
        await currentUser.save();
        res.redirect(`/users/${currentUser._id}/boards/`);
    }catch (error) {
        console.log(error);
        res.redirect('/');
    };
});

router.delete('/:userId/boards/:boardId', async (req,res) => {
    try{
        const currentUser = await User.findById(req.params.userId);
        const boardItem = currentUser.boards.id(req.params.boardId);
        boardItem.deleteOne();
        await currentUser.save();
        res.redirect(`/users/${currentUser._id}/boards/`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

module.exports = router;
