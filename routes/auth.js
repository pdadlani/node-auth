const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const {registerValidation, loginValidation} = require('../validation');


router.post('/register', async (req, res) => {

  // // Validate data before making a user
  const {error} = registerValidation(req.body);
  
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Check if user is already in the database
  const usernameExist = await User.findOne({username: req.body.username});
  if (usernameExist) {
    return res.status(400).send("Username already exists.");
  };

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Create a new user
  const user = new User({
    username: req.body.username,
    password: hashedPassword
  });

  try{
    const savedUser = await user.save();
    res.send(savedUser);
  }catch(error){
    res.status(400).send(error);
  }
});

module.exports = router;