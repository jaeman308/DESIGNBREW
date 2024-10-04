const express = require('express');
const router = express.Router();
const User = require('../models/user.js')

router.get('/:userId/boards', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.render('boards/index.ejs', {
            boards: user.boards,
            userName: user.name,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.get('/:userId/boards/new', async (req, res) => {
    res.render('boards/new.ejs');
});

router.get('/userId/boards/:boardId/edit', async (req,res) => {
    try{
        const currentUser = await User.findById(req.session.user._id);
        const boardItem = currentUser.boards.id(req.params.boardId);
        res.render('boards/edit.ejs',{
            board: boardItem,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.put('/:userId/boards/:boardId', async (req, res) => {
    try{
        const currentUser = await User.findByID(req.session.user._id);
        const boardItem = currentUser.boards.id(req.params.boardId);
        boardItem.room = req.body.room;
        boardItem.category = req.body.category;
        boardItem.image = req.body.image;
        boardItem.description = req.body.description;
        await currentUser.save();
        res.redirect(`/users/${currentUser._id}/boards/`);

    } catch (error) {
        console.log(error);
        res.redirect('/');
}
});

router.post('/:userId/boards', async (req,res) => {
    try {
        const currentUser = await User.findById(req.session.user_id);
        const newboardItem= {
            room: req.body.room,
            category: req.body.category,
            image: req.body.image,
            description: req.body.description,
        };
        currentUser.boards.push(newboardItem);
        await currentUser.save();
        res.redirect(`/users/${currentUser._id}/boards/`);
    }catch (error) {
        console.log(error);
        res.redirect('/');
    };
});

router.delete('/:userId/boards', async (req,res) => {
    try{
        const currentUser = await User.findById(req.session.user_id);
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
