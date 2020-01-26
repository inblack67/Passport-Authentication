const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();


// passing onto passport 
require('./config/passport')(passport);


// db config
const db = require('./config/keys').MongoURI;

// mongo connect
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Mongo is here');
})
.catch(err => {
  console.log(err);
})

;

// body parser
app.use(express.urlencoded({extended: false}));

// express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));


// passport middleware
app.use(passport.initialize());
app.use(passport.session());


// connect flash middleware
app.use(flash());

// custom vars
app.use((req,res,next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');    // failure redirect?
  next();
});


// user global var
app.use((req,res,next) => {

  res.locals.user = req.user || null;
  next();

});


// ROUTES
app.use('/', require('./routes/index'));    // pertain to the given path
app.use('/users', require('./routes/users'));



// handlebars middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});