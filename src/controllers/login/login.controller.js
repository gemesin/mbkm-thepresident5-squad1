const express = require('express');
const { userModel } = require("../../models");

const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Temukan pengguna berdasarkan email yang diberikan
    const user = await userModel.findOne({
        where: {
            email: email
        }
    });

    if (!user) {
        // Jika pengguna tidak ditemukan, berikan respons "Gagal login"
        return res.status(400).json({
            message: "Gagal login",
            data: {}
        });
    }


    if (user.password !== password) {
        // Jika password tidak cocok, berikan respons "Gagal login"
        return res.status(400).json({
            message: "Gagal login",
            data: {}
        });
    }

    // Jika email dan password cocok, berikan respons "Berhasil login"
    return res.status(200).json({
        message: "Berhasil login",
        data: {
            nama: user.nama,
            email: user.email
        }
    });
});


// router.get("/register", async (req, res) => {
//     const dataUser = await userModel.findAll();

//     return res.status(200)
//         .json({
//             message: "Berhasil mendapatkan semua data user.",
//             data: dataUser,
//         });
// });


module.exports = router;