const mongoose = require('mongoose');

// define the Bouquet model schema
const BouquetSchema = new mongoose.Schema({
  userId: String,
  flowers: Array,
  container: Object,
  price: Number
});

module.exports = mongoose.model('bouquets', BouquetSchema);