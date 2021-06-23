const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var patientSchema = new Schema({
  _id : String,
  name: { type: String, max: 100, required: true}
});

module.exports = mongoose.model('Patient', patientSchema);