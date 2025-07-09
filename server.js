const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// ✅ Constant Port Number
const PORT = 3002;

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/spotify_clone', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// ✅ Mongoose Schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  language: String,
});

const User = mongoose.model('User', userSchema);

// ✅ Routes

// Signup Route
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = new User({ email, password });
  await newUser.save();

  res.status(201).json({ message: 'Signup successful' });
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.status(200).json({ message: 'Login successful', email: user.email });
});

// Set Language Route
app.post('/set-language', async (req, res) => {
  const { email, language } = req.body;

  const user = await User.findOneAndUpdate({ email }, { language }, { new: true });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({ message: 'Language updated successfully' });
});

// Get Language Route
app.get('/get-language/:email', async (req, res) => {
  const { email } = req.params;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({ language: user.language });
});

// ✅ Start Server on Constant Port
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
