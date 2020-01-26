const epxress = require('express');
const router = epxress.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// models
const User = require('../models/User');


// user login
router.get('/login', (req, res) => {
  res.render('index/login');
}); 

// user register
router.get('/register', (req, res) => {
  res.render('index/register');
}); 

// post handle, handling post request that is.
router.post('/register', (req,res) => {

  const {name, email, password, password2} = req.body;  // destructuring

  let errors = [];

  // required fields - all of them
  if(!name || !email || !password || !password2)
  {
    errors.push({msg: 'All fields are required'});
  }

  // password match
  if(password !== password2)
  {
    errors.push({msg: 'Passwords mismatched!'});
  }

  // password strength
  
  if(password.length < 6)
  {
    errors.push({msg: 'Password must be atleast 6 characters'});
  }

  if(errors.length > 0)
  {
    res.render('index/register', {
      errors,
      name,
      email,
      password,
      password2
    });
  }
  else
  {
    User.findOne({email: email})
    .then(user => {

      if(user)
      {
        // user already exists
      errors.push({msg: 'Email is already registered'});
      res.render('index/register', {      // render again
        errors,
        name,
        email,
        password,
        password2
      });
      }

      else
      {
        const newUser = new User({
          name,email,password
        });

        // hash password
        bcrypt.genSalt(10, (err,salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;

            // set pass to hash pass
            newUser.password = hash;

            // save user
            newUser.save()
            .then((user) => {
              req.flash('success_msg','You are now registered');
              res.redirect('/users/login');
            })
            .catch(err => {console.log(err)})
            ;
          })
        });
      }

    })
    ;
  }
});


// login done
router.post('/login', (req,res,next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req,res,next);       // using local strategy
});


// logging out
router.get('/logout', (req,res) => {
  req.logout(); // by passport ofc
  req.flash('success_msg', 'Logged Out');
  res.redirect('/users/login');
});

module.exports = router;