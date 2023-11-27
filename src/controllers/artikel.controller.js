const express = require('express');
const {artikelModel} = require('../models');
const router = express.Router();

router.get("/artikel", async (req,res) => {

    const listArtikel = await artikelModel.findAll();

    if (!listArtikel){
        return res.status(404).json({
            msg: "Artikel tidak ada"
        })
    }
    return res.status(200)
        .json({
            msg: "Berhasil mendapatkan semua list artikel",
            data: listArtikel,
        });
})

router.get("/artikel/:id", async (req,res) => {
    const id = req.params.id;

    const listArtikelById = await artikelModel.findOne({
        where: {id : id}
    });

    if (!listArtikelById){
        return res.status(404).json({
            msg: "Artikel tidak ada"
        })
    }
    return res.status(200)
        .json({
            msg: `Berhasil mendapatkan artikel id ${id}`,
            data: listArtikelById,
        });
})

module.exports = router;