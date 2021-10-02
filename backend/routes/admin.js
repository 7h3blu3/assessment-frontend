const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')
const {adminRole, contentManagerRole, reviewerRole} = require('../middleware/is-role')

const router = express.Router();

router.get("/panel", isAuth, adminRole(), adminController.getPanel)

router.get("/list-users", isAuth, adminRole(), adminController.getListUsers)

router.get("/archived-users", isAuth, adminRole(), adminController.getListArchivedUsers)

router.get("/edit-users/:userId", isAuth, adminRole(), adminController.getEditUsers)

router.get("/add-scenarios", isAuth, contentManagerRole(), adminController.getAddScenarios)

router.get("/edit-scenarios/:scenarioId", isAuth, contentManagerRole(), adminController.getEditScenarios)
 
router.get("/list-scenarios", isAuth, contentManagerRole(), adminController.getListScenarios)

router.get("/archived-scenarios", isAuth, contentManagerRole(), adminController.getListArchivedScenarios)

router.get("/assign-scenarios", isAuth, adminRole(), adminController.getAssignScenarios)

router.get("/user-submission", isAuth, reviewerRole() ,adminController.getUserSubmission)

router.get("/submission-grade/:userId/:scenarioId", isAuth, reviewerRole() ,adminController.getSubmissionGrade)

// router.post("/panel", isAuth, adminRole(), adminController.postPanel)

router.post("/edit-users", isAuth, adminRole(), adminController.postEditUsers)

router.post("/archived-users", isAuth, adminRole(), adminController.postArchivedUsers)

router.post("/restore-users", isAuth, adminRole(),  adminController.postRestoreUsers)

router.post("/delete-user", isAuth, adminRole(), adminController.postDeleteUser)

router.post("/add-scenarios", isAuth, contentManagerRole(), adminController.postAddScenario)

router.post("/edit-scenarios", isAuth, contentManagerRole(),  adminController.postEditScenario)

router.post("/move-scenario", isAuth, contentManagerRole(),  adminController.postMoveScenario)

router.post("/clone-scenario", isAuth, contentManagerRole(),  adminController.postCloneScenario)

router.post("/delete-scenario", isAuth, contentManagerRole(),  adminController.postDeleteScenario)

router.post("/restore-scenario", isAuth, contentManagerRole(),  adminController.postRestoreScenario)

router.post("/assign-scenarios", isAuth, reviewerRole(), adminController.postAssignScenario)

router.post("/submission-grade", isAuth, reviewerRole(), adminController.postSubmissionGrade)

module.exports = router;
