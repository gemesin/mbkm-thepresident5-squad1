const express = require('express');
const forumController = require("../controllers/forum.controller")
const router = express.Router();

router.get("/forum", forumController );
router.post("/forum/new-post", forumController );
module.exports = router;