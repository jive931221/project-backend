const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');


router.get('/users/singin', (req, res) => {
    res.render('users/singin');
});
router.post('/users/singin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/singin',
    failureFlash: true
}))
router.get('/users/singup', (req, res) => {
    res.render('users/singup');
});

router.post('/users/singup', async (req, res) => {
    let errors = [];
    const { name, email, password, confirm_password } = req.body;
    if (password !== confirm_password) {
        errors.push({ text: "Passwords do not match." });
    }

    if (password.length < 4) {
        errors.push({ text: "Passwords must be at least 4 characters." });
    }

    if (errors.length > 0) {
        res.render("users/singup", {
            errors,
            name,
            email,
            password,
            confirm_password,
        });
    } else {
        const emailUser = await User.findOne({ email: email });
        if (emailUser) {
            req.flash('error_msg', 'The mail is already in use');
            res.redirect('/users/singup');
        } else {
            const newUser = new User({ name, email, password });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'You are registered');
            res.redirect('/users/singin');
        }
    }
});
router.get('/users/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            // Manejar el error si ocurre
            console.log(err);
            req.flash('error_msg', 'Failed to logout');
            res.redirect('/'); // Redireccionar a la página principal u otra página apropiada
        } else {
            req.flash('success_msg', 'You are logged out now.');
            res.redirect('/users/singin');
        }
    });
});
module.exports = router;