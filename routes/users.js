var express = require('express')
var router = express.Router();

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

var User = require('../models/user')

//get singup page
router.get('/register', function(req, res){
    res.render('register')

});

// get login
router.get('/login', function(req, res){
    res.render('login')

});

// post register, where we save new user data
router.post('/register', function(req, res){
    console.log("hello")
    var name = req.body.name
    var username = req.body.username
    var email = req.body.email
    var password = req.body.password

    console.log(name)

    //perform validations on the fields, which are required

    req.checkBody('name', 'Name Required').notEmpty();
    req.checkBody('email', 'Email Required').notEmpty();
    req.checkBody('email', 'Invalid Email').isEmail();
    req.checkBody('username', 'User Name Required').notEmpty();
    req.checkBody('password', 'Password Required').notEmpty();
    req.checkBody('password2', 'Passwords not matched').equals(req.body.password);
    req.checkBody('name', 'Name Required').notEmpty();

    var errors = req.validationErrors();

    if(errors){
        console.log('error in registration')
        res.render('register',{
            errors: errors
        })
    } else {
        console.log('Registration successful')
        // create instance of new user
        var newUser = new User({
               name: name,
               email: email,
               username: username,
               password: password
        });

        // create the actual user
        User.createUser(newUser, function(err, user){
            if(err) {
                throw err;
            }
            console.log(user);

        });

        req.flash('success_msg',"You are now registered, please login");
        res.redirect('/users/login')
    }

});

// These are functions created for User model in models/ user.
passport.use(new LocalStrategy(
  function(username, password, done) {
        User.getUserByUsername(username, function(err, user){
            if(err) throw err;
            if(!user){
                return done(null, false,{message: 'User Unknown'});
            }
            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                      return done(null, user);
                } else {
                       return done(null, false, {message:'Wrong Password'})
                }
            });

        });
  }));

// serialize and deserialize user
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

// from passport strategy documentation, post login
router.post('/login',
  passport.authenticate('local',{successRedirect:'/', failureRedirect:'/users/login', failureFlash:true}),
  function(req, res) {
        res.redirect('/')
  });

// handle logout
router.get('/logout', function(req, res){
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/users/login');
});


module.exports = router;