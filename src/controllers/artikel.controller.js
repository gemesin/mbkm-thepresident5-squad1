const express = require('express');
const {artikelModel, bookmarkModel} = require('../models');
const router = express.Router();
const passport = require('../config/passport');

router.use(passport.authenticate('jwt', { session: false }));

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
    console.log(id)
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

// router.post('/artikel/bookmark',  async (req, res) => {
//     try {
//         const userId = req.user;

//         const { id_artikel, judul } = req.body;

//         const bookmarkArtikel = await bookmarkModel.create({
//             id_artikel: id_artikel,
//             judul: judul,
//             id_user: userId.id
//         });

//         return res.status(200).json({
//             msg: "Artikel disimpan",
//             data: bookmarkArtikel
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             msg: "Internal Server Error"
//         });
//     }
// });
module.exports = router;