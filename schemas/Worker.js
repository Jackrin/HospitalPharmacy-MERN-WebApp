const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var workerSchema = new Schema({
  name: { type: String, max: 100, required: true},
  passwordHash: { type: String, max: 100, required: true},
  job: { type: String, max:50, required: true}
});

module.exports = mongoose.model('Worker', workerSchema);

// doctor1.save(function (err) {
//     if (err) return handleError(err);
//     console.log("Successfully added")
// });

// var doctor1 = new doctorModel({ firstName: 'test1', lastName: 'test2'});