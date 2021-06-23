
const express = require('express')
const path = require('path')
const cors = require('cors');
const mongoose = require('mongoose')
const session = require('express-session')
const csrf = require('csurf')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const MemoryStore = require('memorystore')(session)
const app = express()
const PORT = 3001
const MongoDB = 'mongodb://localhost:3002/db'

const Worker = require('./schemas/Worker');
const Medication = require('./schemas/Medication');
const Patient = require('./schemas/Patient');
const Report = require('./schemas/Report');

// Connection to database AND Starts listening
mongoose.connect(MongoDB, { useNewUrlParser: true, useUnifiedTopology: true})
  .then (() => app.listen(PORT, () => console.log(`Server running on port : ${PORT}`)))
  .catch((error) => console.log(error.message))

  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useUnifiedTopology', true);

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
}

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'ZF9dadOJRZ5gsYpZZtJsuAUQClq1Kx9Uf8bxsovA',
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly:true, maxAge: 1800000},
  store: new MemoryStore({
      checkPeriod: 1800000
    }),
}))

app.use(csrf());

function sessionCheck(req, res){
  if (typeof req.session.userId !== 'undefined') {
    return true
  }
  else {
    return res.json({ result: "Not logged" })
  }
}

app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)
  res.status(403)
  res.json({result: "Invalid CSRF Token"})
})

app.get('/api/csrf', (req, res) => {
  res.send({csrfToken: req.csrfToken() })
});

app.post('/api/session', (req, res) => {
  if (typeof req.session.userId !== 'undefined') {
    return res.json({result: "Logged", job: req.session.job})
  }
  else {
    return res.json({ result: "Not logged" })
  }
});

app.post('/api/login', async (req, res) => {
  var name = req.body.name
  var password = req.body.password
  var user = await Worker.findOne({ name: name }).exec()
  if (!user) return res.json({ result: "Invalid credentials" })
  var validPassword = await bcrypt.compare(password, user.passwordHash)
  if (!validPassword) return res.json({ result: "Invalid credentials" })
  var job = user.job
  req.session.userId = req.session.id
  req.session.user = user.name
  req.session.job = user.job
  req.session.workerId = user._id
  req.session.page = 0
  res.json({result: "Login successful", job: job})
})

app.post('/api/logout', async (req, res) => {
  await sessionCheck(req, res)
  req.session.destroy()
  res.json({result: "Logged out"})
})

app.post('/api/prescriptions', async (req, res) => {
  await sessionCheck(req, res)
  var direction = req.body.direction
  var searchString = req.body.search
  if(req.body.sortParams == 'creationSort'){
    var dateSort = 1
  }
  else{
    var dateSort = -1
  }
  if (req.body.state == "reviewed"){
    var reportState = true
  }
  else {
    var reportState = false
  }
  if (req.session.job == "pharmacist"){
    var reportCount = await Report.countDocuments({checked: reportState})
  }
  else if(req.session.job == "doctor"){
    var reportCount = await Report.countDocuments({checked: reportState, doctor: req.session.workerId})
  }
  var pages = Math.ceil(reportCount / 10)
  if (direction == "next" && req.session.page < (pages- 1)){
    req.session.page++
  }
  else if (direction == "back" && req.session.page > 0){
    req.session.page--
  }
  var skip = req.session.page * 10
  if((skip + 10) < reportCount){
    var range = (skip + 10)
  }
  else {
    var range = (skip + 1) + (reportCount - (skip + 1))
  }
  if (typeof searchString === 'undefined'){
    searchString = ''
  }
  var medicationList = await Medication.find()
  if (req.session.job == "pharmacist"){
    var reportList = await Report.find({checked: reportState}).sort({date: dateSort})
    .fuzzySearch(searchString).populate({path:"presc", select:'name quantity _id'})
    .populate({path:"doctor", select:'name -_id'}).skip(skip).limit(10).exec()
  }
  else if(req.session.job == "doctor"){
    var reportList = await Report.find({checked: reportState, doctor: req.session.workerId}).sort({date: dateSort})
    .fuzzySearch(searchString).populate({path:"presc", select:'name quantity _id'})
    .populate({path:"doctor", select:'name -_id'}).populate({path:"patient", select:'name _id'}).skip(skip).limit(10).exec()
  }
  skip = (skip + 1)
  if (reportCount == 0){
    skip = (skip - 1)
  }
  res.json({medications: medicationList, report: reportList, pages: {count: reportCount, current: (skip), range: range}})
});

app.post('/api/prescriptionEdit', async (req, res) => {
  await sessionCheck(req, res)
  var reportToCheck = await Report.findOne({'_id' : req.body.reportId}).exec()
  if(req.body.action == "check"){
      reportToCheck.checked = true
  }
  else if(req.body.action == "restore"){
    reportToCheck.checked = false
  }
  reportToCheck.save().then(function(document) {
    if (document){
      return res.json({result: "Update successful", action: req.body.action})
    }
    else {
      return res.json({result: "Update error", action: req.body.action})
    }
  })
  .catch(function(err){
    if (err) {
      console.log(err)
      return res.json({result: "Update error"})
    }
  })
});

app.post('/api/reportAdd', async (req, res) => {
  await sessionCheck(req, res)
  var reportToAdd = req.body.reportToAdd
  var medicationsArray = reportToAdd.medications.map(medication => medication._id)
  Report.create({
    doctor: req.session.workerId,
    notes: reportToAdd.notes,
    healthData: reportToAdd.healthData,
    checked: false,
    ward: reportToAdd.ward,
    patient: reportToAdd.patient,
    presc: medicationsArray,
    date: reportToAdd.date
  }, function (err) {
    if (err){
      res.json({result: "Add error"})
    }
    else{
      res.json({result: "Added"})
    }
  })
}) 

// app.use(express.static(path.join(__dirname, 'client', 'build')));

// app.use('*', function (req, res) {
//   res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
// });