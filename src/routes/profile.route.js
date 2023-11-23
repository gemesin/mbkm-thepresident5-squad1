const express = require('express');
const profileController = require("../controllers/profile.controller")
const router = express.Router();

router.get("/profile/userprofile/:id", profileController );
router.put("/profile/edituser/:id", profileController );
module.exports = router;
