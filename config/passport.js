const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');   // compare the hash?


// User model
const User = require('../models/User');


module.exports = (passport) => {   // passport will be passed onto by indexjs

  passport.use(
    new LocalStrategy({
      usernameField: 'email'
    }, (email, password, done) => {
      // match the user
      User.findOne({
        email: email
      })
      .then(user => {
        if(!user)
        {
          return done(null, false, {message: 'That email is not registered'});
        }
        // match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if(err) throw err;
          if(isMatch)
          {
            return done(null, user);
          }
          else
          {
            return done(null, false, {message: 'Password incorrect'});
          }
        });
      })
      .catch(err => {console.log(err)})
      ;
    })
  );

// In a typical web application, the credentials used to authenticate a user will only be transmitted during the login request. If authentication succeeds, a session will be established and maintained via a cookie set in the user's browser.
// Each subsequent request will not contain credentials, but rather the unique cookie that identifies the session. In order to support login sessions, Passport will serialize and deserialize user instances to and from the session.
// In this example, only the user ID is serialized to the session, keeping the amount of data stored within the session small. When subsequent requests are received, this ID is used to find the user, which will be restored to req.user.
// The serialization and deserialization logic is supplied by the application, allowing the application to choose an appropriate database and/or object mapper, without imposition by the authentication layer.

  passport.serializeUser((user,done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id,done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

}