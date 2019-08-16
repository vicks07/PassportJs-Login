const express = require('express');
const app = express();
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');


const db = require('./config/keys.js').MongoURI;
const passport = require('passport');



require('./config/passport.js')(passport); 

mongoose.connect(db,{useNewUrlParser:true})
.then(()=>   console.log('MongoDB Connected'))
.catch(err=> console.log(err));


app.use(expressLayouts);
app.set('view engine','ejs');


//Body parser

app.use(express.urlencoded({extended:false}));


//Express Session 
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true//,
    //cookie: { secure: true }
  }));

app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

//Global vars

app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');

    next();
})
  

//51:33


app.use('/',require('./routes/index.js'));
app.use('/users',require('./routes/users.js'));

const port = process.env.PORT || 5000;


app.listen(port,console.log(`Server started on ${port} `));