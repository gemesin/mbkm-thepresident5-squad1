const express = require('express');
const artikelController = require("../controllers/artikel.controller")
const router = express.Router();

router.get("/artikel", artikelController);

module.exports = router;