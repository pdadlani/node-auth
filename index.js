const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Import routes
const authRoute = require('./routes/auth');

dotenv.config();

// Connect to DB
mongoose.connect(
  process.env.DB_CONNECT, 
  { useUnifiedTopology: true },
  () => console.log('connected to db!')
);

// Middleware 
app.use(express.json());

// Route Middlewares
app.use('/api/user', authRoute);

app.listen(5000, () => {
  console.log('\nServer up and running\n');
});