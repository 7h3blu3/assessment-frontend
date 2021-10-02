const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    default: "User"
  },
  resetToken: String,
  resetTokenExpiration: Date,
  scenarioId: {
    type: Schema.Types.ObjectId,
          ref: 'Scenario'
  },
  assignedTests: {
    type: Array
  },
  submittedTests:{
      type: [Array]
  },
  finalGrade:{
    type: [Array]
  },  
  alreadyAssigned: {
    type: [Array]
  },
  assignedType3: {
    type: [Array]
  },
  mission: {
    type: String,
    uppercase: true
  },
  level: {
    type: String,
    default: "Foundation"
  },
  testCounter: {
    type: Number,
    default: 1
  },
  time: {
    type: [Array]
  }
})

module.exports = mongoose.model('User', userSchema);  