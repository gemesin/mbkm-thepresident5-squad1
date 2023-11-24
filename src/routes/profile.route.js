const express = require('express');
const profileController = require("../controllers/profile.controller")
const router = express.Router();

router.get("/profile/user-profile", profileController );
router.put("/profile/edit-profile", profileController );
module.exports = router;
