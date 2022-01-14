const Scenario = require("../models/scenario")
const scenarioBackup = require("../models/scenarioBackup")
const nodemailer = require('nodemailer')
const User = require("../models/user")
const userBackup = require("../models/userBackup")

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "6e10fe391f6bd2",
    pass: "4745b00e704e6a"
  }
})

exports.getPanel = (async (req, res, next) => {
      const scenario = await Scenario.find()
      const allMissions = []
      scenario.forEach(element => allMissions.push(element.mission))
      const filteredMissions = allMissions.filter((item, i, ar) => ar.indexOf(item) === i)
      filteredMissions.forEach(element => console.log(element))

  try {
    res.render("admin/panel", {
      pageTitle: "Admin Panel",
      path: "/admin/panel",
      filteredMissions
    })
  } catch(e){
    console.log(e)
    res.status(500).send(e)
  }  
})

// exports.postPanel = (async (req, res, next) => {
//   const mission = req.body.mission

//     try {
//       const scenario = new Scenario({
//         mission: mission
//       })

//       console.log(scenario)
//       } catch(e){
//       console.log(e)
//       res.status(500).send(e)
//       }  
//     })

exports.getListUsers = (async (req, res, next) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch(e){
    console.log(e)
    res.status(500).json({
      message: "Create scenario render failed"
    })
  }  
})

exports.getListArchivedUsers = (async (req, res, next) => {
  try {
    const usersBackup = await userBackup.find()

    res.status(200).json(usersBackup)
  } catch(e){
    console.log(e)
    res.status(500).json({
      error: e
    })
  }  
})


exports.getEditUsers = (async (req, res, next) => {
  const scenario = await Scenario.find()

  const userId = req.params.userId
 
  const allMissions = []
  scenario.forEach(element => allMissions.push(element.mission))
  const filteredMissions = allMissions.filter((item, i, ar) => ar.indexOf(item) === i)
  filteredMissions.forEach(element => console.log(element))

  try {
    const user = await User.findById(userId)
    if (!user) {
      return res.redirect('/admin/panel')
    }
    res.render('admin/edit-users', {
      pageTitle: 'Edit Users',
      path: '/admin/edit-users',
      user: user,
      filteredMissions
    })
  } catch(e){
    console.log(e)
    res.status(500).send(e)
  }  
})

exports.postEditUsers = (async (req, res, next) => {
  const userId = req.body.userId
  const updatedType = req.body.userType
  const updatedLevel = req.body.level
  const updatedMission = req.body.mission

  try {
    const user = await User.findById(userId)
    user.userType = updatedType
    user.level = updatedLevel
    user.mission = updatedMission
    user.save()
    console.log('User updated!')
      res.redirect('/admin/list-users')
  } catch(e){
    console.log(e)
    res.status(500).send(e)
  }  
})

exports.postArchivedUsers = (async (req, res, next) => {
  const userId = req.params.id
  console.log("The user id is " + userId)
  console.log("The user id isss ", userId)
  try {
    const user = await User.findById(userId)

    const usersBackup = new userBackup({
      userType: user.userType,
      level: user.level,
      mission: user.mission,
      assignedTests: user.assignedTests,
      email: user.email,
      password: user.password,
      testCounter: user.testCounter,
      submittedTests: user.submittedTests,
      finalGrade: user.finalGrade,
      time: user.time,
      alreadyAssigned: user.alreadyAssigned,
      _id: user._id,
      userId: req.user,
    })

    await usersBackup.save()
    await User.findByIdAndDelete(userId)
    console.log('User archived!')
  } catch(e){
    console.log(e)
    res.status(500).send(e)
  }  
})

exports.postRestoreUsers = (async (req, res, next) => {
  const userBackupId = req.params.id
  try {
    const userBckp = await userBackup.findById(userBackupId)
    const user = new User({
      userType: userBckp.userType,
      level: userBckp.level,
      mission: userBckp.mission,
      assignedTests: userBckp.assignedTests,
      email: userBckp.email,
      password: userBckp.password,
      testCounter: userBckp.testCounter,
      submittedTests: userBckp.submittedTests,
      finalGrade: userBckp.finalGrade,
      time: userBckp.time,
      alreadyAssigned: userBckp.alreadyAssigned,
      _id: userBckp._id,
      userId: req.user,
    })

    await user.save()
    await userBackup.findByIdAndDelete(userBackupId)
    console.log('User Restored!')
  } catch(e){
    console.log(e)
    res.status(500).send(e)
  }  
})

exports.postDeleteUser = (async (req, res, next) => {
  const userBackupId = req.body.userBackupId
  try {
    await userBackup.findByIdAndDelete(userBackupId)
    console.log('User deleted');
      res.redirect('/admin/archived-users')
  } catch(e){
    console.log(e)
    res.status(500).send(e)
  }
})

// NOTE!!! - edit-scenarios.ejs page is used for create and EDIT scenarios 
exports.getcreateScenarios = (async (req, res, next) => {

  try {
    const scenario = await Scenario.find()
    
    const allMissions = []
    scenario.forEach(element => allMissions.push(element.mission))
    const filteredMissions = allMissions.filter((item, i, ar) => ar.indexOf(item) === i)
    filteredMissions.forEach(element => console.log(element))

    res.status(200).json({
      message: "Create scenario render success",
      pageTitle: 'Create Scenarios',
      filteredMissions,
    })
    // res.render('admin/edit-scenarios', {
    //   pageTitle: 'Create Scenarios',
    //   path: '/admin/create-scenarios',
    //   editing: false,
    //   filteredMissions
    // })
  } catch(e){
    console.log("Create scenario render failed" + e)
    res.status(500).json({
      message: "Create scenario render failed"
    })
  }  
})

// NOTE!!! - edit-scenarios.ejs page is used for create and EDIT scenarios 
exports.getEditScenarios = (async (req, res, next) => {
  const editMode = req.query.edit
  const scenarioId = req.params.scenarioId
  try {
    if (!editMode) {
      return res.redirect('/admin/panel')
    }
    const scenario = await Scenario.findById(scenarioId)
    const findScenario = await Scenario.find()

    const allMissions = []
    findScenario.forEach(element => allMissions.push(element.mission))
    const filteredMissions = allMissions.filter((item, i, ar) => ar.indexOf(item) === i)
    filteredMissions.forEach(element => console.log(element))

    res.render('admin/edit-scenarios', {
      pageTitle: 'Edit Scenarios',
      path: '/admin/edit-scenarios',
      editing: editMode,
      scenario: scenario,
      filteredMissions,
    })
    console.log(findScenario)
  } catch(e){
    console.log(e)
    res.status(500).send(e)
  }  
})

exports.getListScenarios = (async (req, res, next) => {
  try{
    const scenarios = await Scenario.find()
    res.status(200).json({
      message: "Scenarios Fetched",
      pageTitle: 'List Scenarios',
      scenarios: scenarios
    })
  } catch(e){
    console.log("There is an error with listing scenarios " + e)
    res.status(500).send(e)
  }  
})

exports.getListArchivedScenarios = (async (req, res, next) => {
  try{
    const scenariosBackup = await scenarioBackup.find()
      
    res.status(200).json(scenariosBackup)

  } catch(e){
    console.log("Archiving user failed" + e)
    res.status(500).json({
      message: "Archiving user failed"
    })
  }  
})


exports.getAssignScenarios = (async (req, res, next) => {
  try{
      const user = await User.find({})   
      const scenarioFindType3 = await Scenario.find({type: "Type3"})
      console.log("Log this ", scenarioFindType3)
      res.status(200).json({
        user: user,
        type3: scenarioFindType3
      })
    } catch(e){
      res.status(500).json({
        message: "Assigning scenario failed"
      })
    }  
})

exports.postAssignScenario = (async (req, res, next) => {
  const email = req.body.user
  const id = req.body.scenarioId
  const scenario = req.body.scenario.split(", ")
  // const scenario = req.body.scenario

  
  const assignedAttributes = [scenario._id]

  console.log(id)
  console.log(scenario[0])
  console.log(scenario[1])
  console.log(scenario[2])

  try {
    const findUser = await User.findOne({email: email})
    const user = await User.findByIdAndUpdate(findUser.id, {$push: {assignedType3: scenario[0]}}, {new: true, runValidators: true, useFindAndModify:false})
    
    // res.redirect('/admin/assign-scenarios')
    if(!user) {
      return res.status(400).send("yo")
  }
  // res.redirect('list-scenarios')
  } catch (e) {
    console.log(e)
    res.status(400).send(e + "CATCH ERROR")
  }
})

exports.postDeleteScenario = (async (req, res, next) => {
  const scenarioBackupId = req.body.scenarioBackupId
  console.log(scenarioBackupId)
  try {
    await scenarioBackup.findByIdAndDelete(scenarioBackupId)
    console.log('Scenario Deleted!')
    res.redirect('/admin/archived-scenarios')
  } catch (e) {
  console.log(e)
  res.status(400).send(e)
  }
})

exports.postRestoreScenario = (async (req, res, next) => {
  const scenarioBackupId = req.params.id
  console.log("What the id ", scenarioBackupId)
  try {
    const scenarioBckp = await scenarioBackup.findById(scenarioBackupId)
    const scenario = new Scenario ({
      title: scenarioBckp.title,
      description: scenarioBckp.description,
      mission: scenarioBckp.mission,
      level: scenarioBckp.level,
      type: scenarioBckp.type,
      passingGrade: scenarioBckp.passingGrade,
      time: scenarioBckp.time,
      _id: scenarioBckp._id,
      scoreCard: scenarioBckp.scoreCard,
      // userId: req.user,
    })
    await scenario.save()
    await scenarioBackup.findByIdAndDelete(scenarioBackupId)
    console.log('Scenario Restored!')
    res.redirect('/admin/archived-scenarios')
  } catch (e) {
  console.log(e)
  res.status(400).send(e)
  }
})

exports.postArchiveScenario = (async (req, res, next) => {
  const scenarioId = req.params.id

  try{
    const scenario = await Scenario.findById(scenarioId)

    const scenariosBackup = new scenarioBackup({
      // backupscenario: scenario
      title: scenario.title,
      description: scenario.description,
      mission: scenario.mission,
      level: scenario.level,
      type: scenario.type,
      passingGrade: scenario.passingGrade,
      time: scenario.time,
      _id: scenario._id,
      scoreCard: scenario.scoreCard,
      // userId: req.user,
    })
    
    const result = await scenariosBackup.save()
    await Scenario.findByIdAndDelete(scenarioId)
    console.log(result)
    console.log('Scenario archived!')
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
})

exports.postCloneScenario = (async (req, res, next) => {
  const scenarioId = req.body.scenarioId

  try{
    const scenario = await Scenario.findById(scenarioId)

    const scenarioClone = new Scenario({
      title: scenario.title,
      description: scenario.description,
      mission: scenario.mission,
      level: scenario.level,
      type: scenario.type,
      passingGrade: scenario.passingGrade,
      time: scenario.time,
      scoreCard: scenario.scoreCard,
      // userId: req.user,
    })
    
    const result = await scenarioClone.save()
    console.log(result)
    console.log('Scenario Cloned!')
    res.redirect('/admin/list-scenarios')
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
})

exports.postcreateScenario = (async (req, res, next) => {

  const title = req.body.title
  const equalTo100 = req.body.grand_total
  const description = req.body.description
  const mission = req.body.mission
  const level = req.body.level
  const type = req.body.type
  const grade = req.body.grade
  const time = req.body.time
  // const question = req.body.key
  // const weight = req.body.value
  // const scoreCard = [question,weight]
  const scoreCard = req.body.key
  var chunk = []
  scoreCard, chunk
  var total = []

  while (scoreCard.length > 0) {

    chunk = scoreCard.splice(0,2)
    total.push(chunk)
    console.log(chunk)

  }
  console.log('----')
  console.log(total)

  
  try {
    const scenario = new Scenario({
      mission: mission,
      level: level,
      title: title,
      type: type,
      description: description,
      userId: req.user,
      time:time,
      passingGrade: grade,
      scoreCard: total
    })
    while (true)
      {
        if(equalTo100 === "100") {
          scenario.save()
          console.log('Created Scenario')
          res.redirect('/admin/list-scenarios')
          break;    
        }
        else {
          console.log("We need a 100")
          break;
      }
    }
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
})

exports.postEditScenario = (async (req, res, next) => {
  const scnId = req.body.scenarioId;
  const updatedTitle = req.body.title
  const updatedDesc = req.body.description
  const updatedMission = req.body.mission
  const updatedLevel = req.body.level
  const updatedType = req.body.type
  const updatedGrade = req.body.grade
  const updatedTime = req.body.time
  const updatedScoreCard = req.body.key

  try {
    const scenario = await Scenario.findById(scnId)
    scenario.title = updatedTitle
    scenario.description = updatedDesc
    scenario.mission = updatedMission
    scenario.level = updatedLevel
    scenario.type = updatedType
    scenario.grade = updatedGrade
    scenario.time = updatedTime
    scenario.scoreCard = updatedScoreCard
    scenario.save()
    console.log('Scenario updated!')
    res.redirect('/admin/list-scenarios')
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
})

exports.getUserSubmission = (async (req, res, next) => {
  try{
    const user = await User.find({})
    // const reviewerId = await req.session.user._id
    // const reviewer = await User.findById(reviewerId)
    const currentUserId = await req.session.user._id
    const currentUser = await User.findById(currentUserId)
    
    console.log(currentUser)
    res.status(200).json({
        user: user,
        currentUser: currentUser
      })
    } catch(e){
      console.log(e)
      res.status(500).json({
        message: "Assigning scenario failed"
      })
    }  
})

exports.getGradedSubmission = (async (req, res, next) => {
  try{
    const user = await User.find({})
    const currentUserId = await req.session.user._id
    const currentUser = await User.findById(currentUserId)
    
    console.log(currentUser)
    res.render("admin/graded-submission", {
      user,
      currentUser,
      pageTitle: "User Submission",
      path: "/admin/user-submission"
    })
  } catch(e) {
    console.log(e)
    res.status(500).send(e)
  }
})


exports.getSubmissionGrade = (async (req, res, next) => {
  try{
      
      const userId = req.params.userId
      const scenarioId = req.params.scenarioId
      const user = await User.findById(userId)
      const scenario = await Scenario.findById(scenarioId)
      var userInput = "1"

      for (var i = 0; i < user.submittedTests.length; i++) {
        console.log(user.submittedTests[i][0]);
        if(user.submittedTests[i][0] === scenarioId){
          userInput = user.submittedTests[i][1]
        }
    }
      console.log("-------------------")
      console.log(userInput)
      console.log("-------------------")
      console.log(" This is the user ID" + userId)
      console.log(user.submittedTests)
      console.log(" This is the scenario ID" + scenarioId)

      res.render("admin/submission-grade", {
        pageTitle: "Submission Grade",
        path: "/admin/submission-grade",
        user,
        scenario,
        userInput

    })
  } catch(e){
    console.log(e)
    res.status(500).send(e)
  }  
})

exports.postSubmissionGrade = (async (req, res, next) => {
const userId = req.body.userId
const scenId = req.body.scenario_id
console.log(scenId)
const scenarioText = req.body.submission_grade_scenario_description
const userText = req.body.submission_grade_user_description
const scenarioTitle = req.body.scenario_title
const passingGrade = req.body.passing_grade
const scenarioMission = req.body.scenario_mission
const scenarioLevel = req.body.scenario_level
const dropdown = req.body.dropdown
const scoreCardComment = req.body.scenario_card_comment
var total = 0;
if(Array.isArray(req.body.dropdown)) {
    for(i = 0; i< req.body.dropdown.length;i++){
      console.log("result " + req.body.points[i]* req.body.dropdown[i])
      total += req.body.points[i]* req.body.dropdown[i]
    }
    var grade = "";
    if(total < passingGrade){
      grade = "Not Complete."
    }
    else {
      grade = "Complete."
    }
    console.log("User ID " + userId)
    console.log("Scenario Text " + scenarioText)
    console.log("User text " + userText)
    console.log("Dropdown " + dropdown)
    console.log("Total Points from Score Card: " + total)
    console.log(scoreCardComment)
    console.log(scenarioTitle)
}
else{
  total += req.body.points * req.body.dropdown
  console.log('narrr')
  var grade = "";
  if(total < passingGrade){
    grade = "Not Complete."
  }
  else {
    grade = "Complete."
  }
  console.log("User ID " + userId)
  console.log("Scenario Text " + scenarioText)
  console.log("User text " + userText)
  console.log("Dropdown " + dropdown)
  console.log("Total Points from Score Card: " + total)
  console.log(scoreCardComment)
  console.log(scenarioTitle)
}

try {
  
  
  const all = [scenarioText,userText,scenarioTitle,scenarioMission,scenarioLevel,passingGrade,total,grade,scoreCardComment]
  const user = await User.findByIdAndUpdate(userId, {$push: {finalGrade: all}}, {new: true, runValidators: true, useFindAndModify: false})
  console.log(user.submittedTests)
  console.log(user.submittedTests[0])
  for(i = 0; i < user.submittedTests.length; i++){
    if(user.submittedTests[i][0] === scenId){
      console.log("GOT YA!")
      user.submittedTests.splice(i,1)
    }
    console.log(user.submittedTests[i])
  }
  user.save()
  //user.finalGrade = [all]
  console.log(all)
  transporter.sendMail({
    to: user.email,
    from: 'bg@ibm.com',
    subject: 'Grade Completed!',
    html: '<h1>Your work has been graded. Please review!</h1>'
  })
  res.redirect('user-submission')
  } catch (e) {
    console.log(e)
    res.status(400).send(e + "CATCH ERROR")
  }
})