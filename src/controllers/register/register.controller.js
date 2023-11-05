const express = require('express');
const { userModel } = require("../../models");
const validationRegister = require('../../middlewares/register.validation');
const {body, validationResult} = require('express-validator');
const errorHandler = require('../../middlewares/error.handler');
const checkValidasi = require('../../middlewares/register.validation');

const router = express.Router();

router.post("/register", validationRegister, async (req, res) => {
    const { nama, email, password } = req.body;
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const createUser = await userModel.create({
        nama: nama,
        email: email,
        password: password,
        
    });
    return res.status(201)
        .json({
            message: "Berhasil registrasi",
            data: createUser,
        });
});

router.get("/register", async (req, res) => {
    const dataUser = await userModel.findAll();

    return res.status(200)
        .json({
            message: "Berhasil mendapatkan semua data user.",
            data: dataUser,
        });
});

router.use(errorHandler)
module.exports = router;