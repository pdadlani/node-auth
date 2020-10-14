const router = require('express').Router();
const verify = require('./privateRoutes');

router.get('/', verify, (req, res) => {
  res.send(req.user);
  User.findByOne({_id: req.user}); // will pull out info on specific user
});

module.exports = router;