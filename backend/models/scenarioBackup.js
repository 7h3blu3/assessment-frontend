const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const scenarioSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    ref: "Scenario",
    required: true
  },
  mission: {
    type: String,
    required:true
  },
  level: {
      type: String,
      required: true,
  },
  title: {
    type: String,
    required:true
  },
  description: {
    type:String,
    required:true
  },
  type: {
      type: String
  },
  time: {
    type: Number
  },
  scoreCard: {
    type: Array
  },
  passingGrade: {
    type: Number
  },
  // userId: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true
  // }
})

module.exports = mongoose.model('ScenarioBackup', scenarioSchema)