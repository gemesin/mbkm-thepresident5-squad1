const express = require('express');
const lmsController = require('../controllers/lms.controller')
const router = express.Router();

router.get("/lms", lmsController);
router.get("/lms/lesson/:id", lmsController);
router.get("/lms/progres", lmsController);
router.get("/lms/find", lmsController);
router.get("/lms/lesson/:lessonId/section/:sectionId", lmsController);
router.put("/lms/lesson/:lessonId/section/:sectionId", lmsController);
router.post('/lms/add', lmsController)
module.exports = router;