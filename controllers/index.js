var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'File Storage' });
});

/* GET About Page */
router.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

/* GET API Page */
router.get('/api', (req, res) => {
  res.render('api', { title: 'API-Github' });
});

module.exports = router;
