const epxress = require('express');
const router = epxress.Router();
const {ensureAthenticated} = require('../config/auth');


// root
router.get('/', (req, res) => {
  res.render('index/welcome');
}); 

router.get('/dashboard',ensureAthenticated, (req, res) => {
  res.render('index/dashboard', {
    name: req.user.name
  });
}); 


module.exports = router;