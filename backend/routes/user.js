const path = require('path');

const express = require('express');

const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');
const {userRole} = require('../middleware/is-role')

const router = express.Router();

router.get("/start-assessment", isAuth, userRole(), userController.getStartAssessment)

router.get("/assessment", isAuth, userRole(), userController.getAssessment)

router.post("/assessment", isAuth, userRole(), userController.postAssessment)


module.exports = router;
