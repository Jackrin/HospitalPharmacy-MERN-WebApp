const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');
const Double = require('@mongoosejs/double');
const { ObjectId } = require('bson');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var reportSchema = new Schema({
  doctor: { type: Schema.ObjectId, ref: 'Worker' },
  ward: { type: Number, required: true },
  patient: { type: String, max: 100, required: true, ref: 'Patient'},
  date: { type: Date, required: true},
  notes: { type: String, max: 500, required: false},
  healthData: 
      {
          pressMin : { type: Double },
          pressMax : { type: Double },
          temp : { type: Double },
          bpm : { type: Double }
      },
  presc: [{ type: Schema.ObjectId, ref: 'Medication' }],
  checked : { type: Boolean, required: true }
});
reportSchema.plugin(mongoose_fuzzy_searching, { fields: [{name: 'notes', minSize: 1}] });

module.exports = mongoose.model('Report', reportSchema);