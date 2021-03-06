const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../model/User.js');


router.get('/login',(req,res)=>{
    let errors = [];
    res.render('login',{
        errors
    });
})



router.get('/register',(req,res)=>{
    let errors = [];
    res.render('register',{errors});
})


router.post('/register',(req,res)=>{
    const {name,email,password,password2} = req.body;
    let errors = [];

    //Check required fields
    if(!name || !email || !password || !password2){
        errors.push({msg:'Please fill all fields'});
    }

    if(password !== password2){
        errors.push({msg:'Passwords do not match'});
    }

    //Check pass length
    if(password.length <6){
        errors.push({msg:'Passwords should be at least 6 characters'});
    }

    if(errors.length > 0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        })
    }
    else{
        User.findOne({email:email}).then(user=>{
            if(user){
                errors.push({msg:'Email is already registered'});
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            } else{
                const newUser = new User({
                    name,
                    email,
                    password
                });
                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;

                        newUser.password = hash;

                        newUser.save().then(user=>{
                            req.flash('success_msg','You are now registered');
                            res.redirect('/users/login');
                        })
                        .catch()
                    })
                })
            }
        })
        //res.send('Pass');
    }

})


//Login Handle

router.post('/login',(req,res,next)=>{
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
      })(req, res, next);
    
})

//Logout Handle

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
})


module.exports = router;