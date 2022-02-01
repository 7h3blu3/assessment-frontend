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
  mission: {
    type: String,
    uppercase: true
  },
  level: {
    type: String,
    default: "Foundation"
  },
  assignedScenarios: {
    type: [{
      _id : false,
      scenarioId:String
    }]
  },
  submittedScenarios:{
      type: [{
        scenarioId: String,
        scenarioDateTaken: String,
        scenarioTitle: String,
        scenarioDescription: String,
        level: String,
        mission: String
      }]
  },
  finalGrade:{
    type: [{
      scenarioDescription: String,
      userResponse: String,
      scenarioTitle: String,
      scenarioMission: String,
      scenarioLevel: String,
      passingGrade: Number,
      // total,
      // grade,
      // scoreCardComment
      }]
  },  
  alreadyAssigned: {
    type: [{
      _id : false,
      scenarioId: String}]
  },
  assignedType3: {
    type: [{
      _id : false,
      scenarioType3Id:String
    }]
  },
  testCounter: {
    type: Number,
    default: 1
  },
  time: {
    type: [Array]
  },
  resetToken: String,
  resetTokenExpiration: Date,
  scenarioId: {
    type: Schema.Types.ObjectId,
          ref: 'Scenario'
  }
})

module.exports = mongoose.model('User', userSchema);  