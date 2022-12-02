var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'File Storage' , user: req.user });
});

/* GET About Page */
router.get('/about', (req, res) => {
  res.render('about', { title: 'About' , user: req.user  });
});

/* GET API Page */
router.get('/api', (req, res) => {
  res.render('api', { title: 'API-Github' , user: req.user  });
});

module.exports = router;
