const express = require('express');
const router = express.Router();

const passport = require('passport');

const {ensureAuthenticated} = require('../config/auth.js');


router.get('/', (req, res) => res.render('welcome'));
router.get('/dashboard',ensureAuthenticated, (req, res) => res.render('dashboard',{
    name:req.user.name
}));


router.get('/auth/google/init', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
router.get('/auth/google/',
            passport.authenticate('google', {
                    successRedirect : '/dashboard',
                    failureRedirect : '/users/login'
            }));




module.exports = router;