const mongoose = require('mongoose');

// define the User model schema
const FinSchema = new mongoose.Schema({
  imageUrl: String,
  title: String,
  username: String,
  userId: String,
  likes: Array,
  refins: Array,
  time: Date
});

module.exports = mongoose.model('fins', FinSchema);