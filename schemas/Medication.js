const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var medicationSchema = new Schema({
  name: { type: String, max: 100, required: true},
  quantity: { type: Number, required: true}
});

module.exports = mongoose.model('Medication', medicationSchema);