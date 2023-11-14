const express = require('express');
const artikelController = require("../controllers/artikel.controller")
const router = express.Router();

router.get("/artikel", artikelController);
router.get("/artikel/:id", artikelController);
router.post("/artikel/bookmark", artikelController);

module.exports = router;