const mongoose = require('mongoose');

// define the Flower model schema
const FlowerSchema = new mongoose.Schema({
  imageUrl: String,
  name: String,
  price: Number,
  quantity: Number
});

module.exports = mongoose.model('flowers', FlowerSchema);