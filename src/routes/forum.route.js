const express = require('express');
const forumController = require("../controllers/forum.controller")
const router = express.Router();

router.post("/forum/:id/comment/", forumController );
router.post("/forum/new-post", forumController );
router.get("/forum", forumController );
router.get("/forum/:id", forumController );
router.get('/forum/posts/find', forumController)
router.post('/forum/:id/like', forumController);
router.put('/forum/:id/unlike', forumController);

module.exports = router;