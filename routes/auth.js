const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {registerValidation, loginValidation} = require('../validation');

// Register
router.post('/register', async (req, res) => {

  // Validate data before making a user
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
    res.send({user: user._id});
  }catch(error){
    res.status(400).send(error);
  }
});

// Login
router.post('/login', async (req, res) => {
  // Validate data before accessing user info
  const { error } = loginValidation(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  };

  // Check if username exists
  const user = await User.findOne({username: req.body.username});
  if (!user) {
    return res.status(400).send("Username does not exist.");
  }; 

  // Check if password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send("Invalid password.");
  };

  // Create and assign a token
  const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token);
});

module.exports = router;