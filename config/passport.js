const LocalStrategy = require('passport-local').Strategy; 
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const keys = require('./keys.js')


//Load User Model
const User = require('../model/User.js');


module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField:'email'},(email,password,done)=>{
            User.findOne({email:email}).then(user=>{
                if(!user){
                    return done(null,false,{message:'That email is not registered'});
                }

                if(user.password == undefined){
                    return done(null,false,{message:'That email is not registered'});
                }
                //Match password
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err) throw err;

                    if(isMatch){
                        return done(null,user);
                    }
                    else{
                        return done(null,false,{message:'Password incorrect'});
                    }
                });
            })
            .catch(err => console.log(err));
        })
    )

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
    
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
    

      passport.use(new GoogleStrategy({

        clientID        : keys.googleAuth.clientID,
        clientSecret    : keys.googleAuth.clientSecret,
        callbackURL     : keys.googleAuth.callbackURL

    },
    function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            // try to find the user based on their google id
            User.findOne({ 'email' : profile.emails[0].value }, function(err, user) {
                //User.findOne({ 'google.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {

                    // if a user is found, log them in
                    return done(null, user);
                } else {

                    console.log('ELSE PART',profile);
                    // if the user isnt in our database, create a new user
                    var newUser          = new User();

                    // set all of the relevant information
                    newUser.google.id    = profile.id;
                    newUser.google.token = token;
                    newUser.name  = profile.displayName;
                    newUser.email = profile.emails[0].value; // pull the first email

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });

    }));





}