const express = require('express')
const router= express.Router()
const controller= require("../controllers/surveyControllers")

router.get("/",controller.getSurveys)
router.get("/:id",controller.getSurveyById)
router.post("/",controller.createSurvey)
router.delete("/:id",controller.deleteSurvey)




module.exports = router