const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const scenarioSchema = new Schema({
  mission: {
    type: String,
    required:true,
    uppercase: true
  },
  level: {
    type: String,
    required: true
  },
  type: {
    type: String
  },
  title: {
    type: String,
    required:true
  },
  description: {
    type:String,
    required:true
  },
  passingGrade: {
    type: Number
  },
  time: {
    type: Number
  },
  logsUrl: {
    type: String,
  },
  scoreCard: {
    type: [{
      question: String,
      weight: Number
    }]
  },
 
  // userId: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true
  // }
})

module.exports = mongoose.model('Scenario', scenarioSchema)

