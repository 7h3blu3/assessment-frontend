const Scenario = require("../models/scenario")
const User = require("../models/user")


//User Page
exports.getStartAssessment = (async (req, res, next) => {
  try {
    // Will need to use this user when we get session and delete below one
    // const user = await User.findById(req.session.user._id)
    const user  = await User.find()
    console.log(user)
    if(!user) {
      return res.status(404).send()
    }
    // res.render("user/start-assessment", {
    //   user,
    //   pageTitle: "User dashboard",
    //   path: "/user/start-assessment"
    // })
    res.status(200).json({
      message: "Users fetched",
      user: user
    })
  } catch (e){
    console.log("Is there an error " + e)
    res.status(500).send(e)
  }   
})

//Assessment page for user.
exports.getAssessment = (async (req, res, next) => {
  
  try {
    const user = await User.findById(req.session.user._id)

    console.log(user.assignedType3[0])

    // Gotta figure this out
    // const scenarios = await Scenario.find({level: user.level, mission: user.mission})

    // for (var i = 0; i < user.alreadyAssigned.length; i++) {
    //   console.log("I should be printing all of the ID's " + user.alreadyAssigned[i]);
    //   if(user.alreadyAssigned[i] === scenarios._id){
    //   user.assignedTests = []
    //  }
    // }

    // console.log(findDuplicates(strArray)) // All duplicates
    // console.log([...new Set(findDuplicates(strArray))]) // filteredMissions duplicates
    
      //Assign random scenario from type1
      if(user.testCounter === 1){
        
        const docCount = await Scenario.countDocuments({level: user.level,mission: user.mission,type: "Type1"}).exec()
        const rand = Math.floor(Math.random() * docCount)
        const randScenario = await Scenario.findOne({level: user.level,mission: user.mission,type: "Type1"}).skip(rand)
        console.log("Type1")
        if(user.assignedTests < 1)
        user.testCounter = 2
        await user.save()

          if(user.assignedTests < 1) {
          user.assignedTests = randScenario._id
          await user.save()
          }
      //Assign random scenario from type2
      } else if(user.testCounter === 2){
        const docCount = await Scenario.countDocuments({level: user.level,mission: user.mission,type: "Type2"}).exec()
        const rand = Math.floor(Math.random() * docCount)
        const randScenario = await Scenario.findOne({level: user.level,mission: user.mission,type: "Type2"}).skip(rand)
        console.log("Type2")
        if(user.assignedTests < 1)
        user.testCounter = 3             
        await user.save()

          if(user.assignedTests < 1) {
          user.assignedTests = randScenario._id
          await user.save()
        
        } 
      //Get random scenario from the assigned to you type3
      } else if(user.testCounter === 3){
        const randScenario = await Scenario.findOne({_id: user.assignedType3[0]})
        console.log("Type3")
        if(user.assignedTests < 1)
        user.testCounter = 4    
        user.assignedType3 = []        
        await user.save()
        
        if(user.assignedTests < 1) {
        user.assignedTests = randScenario._id
        await user.save()
        }
      }

    if(!user) {
      return res.status(404).send()
    }
    const scenario = await Scenario.findById(user.assignedTests)
    // current timestamp in milliseconds
    const currentDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') //This formats current date like so: 2021-04-28 15:54:08
    const finishDate = new Date(Date.now() + ( 3600 * 1000 * (scenario.time / 60))).toISOString().replace(/T/, ' ').replace(/\..+/, '')
    if(finishDate === currentDate)
    {
      console.log('hi')
    } 
    
    res.render("user/assessment", {
      user,
      scenario,
      currentDate,
      finishDate,
      pageTitle: "Assessment",
      path: "/user/assessment"
    })

  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }   
})

exports.postAssessment = (async (req, res, next) => {
  
  const findUser = await User.findById(req.session.user._id)
  const userSubmit = req.body
  console.log(userSubmit)
  const nowDate = new Date().toUTCString()
  const userSubmitted = [userSubmit.scenarioId , userSubmit.userInput, userSubmit.title, nowDate]
  console.log(nowDate)
  
  console.log("This is the scenario id " + userSubmit.scenarioId)

  

    try{
        
          const user = await User.findByIdAndUpdate(req.session.user._id, {$push: {submittedTests: userSubmitted, Date, alreadyAssigned: findUser.assignedTests}},{new: true, runValidators: true,useFindAndModify: false})
          
          user.assignedTests = []
          console.log(userSubmit.userInput)
          await user.save()

          if(!user) {
          return res.status(400).send("Greetings")
       }
        res.redirect("start-assessment")

        }catch(e){
        res.status(400).send(e + "CATCH ERROR")
      }
})