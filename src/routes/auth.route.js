const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/protected', passport.authenticate('jwt', { session: false }), function(req, res) {
  res.json('Success! You can now see this without a token.');
});

module.exports = router;
