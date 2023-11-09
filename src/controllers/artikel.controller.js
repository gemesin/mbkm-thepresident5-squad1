const express = require('express');
const {artikelModel} = require('../models');
const router = express.Router();

router.get("/artikel", async (req,res) => {

    const listArtikel = await artikelModel.findAll();

    return res.status(200)
        .json({
            msg: "Berhasil mendapatkan semua list artikel",
            data: listArtikel,
        });
})

module.exports = router;