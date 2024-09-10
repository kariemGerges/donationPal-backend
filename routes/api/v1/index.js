var express = require('express');
var router = express.Router();

/* main route. */
router.get('/', function(req, res, next) {
  res.send(`
    <h1>Connected to the server</h1>
    ${process.env.NODE_ENV === 'production' ? 
      '<h2>Production Mode</h2>' :
      '<h2>Development Mode</h2>'
    }
    `);
});

module.exports = router;
