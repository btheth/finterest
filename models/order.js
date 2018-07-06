const mongoose = require('mongoose');

// define the Order model schema
const OrderSchema = new mongoose.Schema({
  userId: String,
  bouquets: Array,
  price: Number,
  status: String,
  shipping: Object,
  billing: Object,
  date: Date
});

module.exports = mongoose.model('orders', OrderSchema);