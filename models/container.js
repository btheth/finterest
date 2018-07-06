const mongoose = require('mongoose');

// define the Container model schema
const ContainerSchema = new mongoose.Schema({
  imageUrl: String,
  name: String,
  price: Number,
  quantity: Number
});

module.exports = mongoose.model('containers', ContainerSchema);