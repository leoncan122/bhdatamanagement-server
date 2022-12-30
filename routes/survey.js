const express = require('express')
const router= express.Router()
const controller= require("../controllers/surveyControllers")

router.get("/",controller.getSurveys)
router.get("/:id",controller.getSurveyById)
router.post("/",controller.createSurvey)
router.post("/survey_result", controller.addSurveyResult)
router.get("/survey_result/:id", controller.getSurveyResultById)
router.get("/all_result_by_survey_id/:id", controller.getResultBySurveyId)
router.put("/", controller.updateSurvey)
router.delete("/:id",controller.deleteSurvey)

router.post("/related", controller.createSecondarySurveySchema)
router.get("/related/:id", controller.getRelatedSurveysBySurveyId)




module.exports = router