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
    type: Object
  },
  passingGrade: {
    type: Number
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

module.exports = mongoose.model('Scenario', scenarioSchema)

