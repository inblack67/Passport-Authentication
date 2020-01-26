const epxress = require('express');
const router = epxress.Router();


// root
router.get('/', (req, res) => {
  res.render('index/welcome');
}); 


module.exports = router;