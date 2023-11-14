const express = require('express');
const { userModel } = require("../models");
const validationRegister = require('../middlewares/register.validation');
const {validationResult} = require('express-validator');
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/register", validationRegister, async (req, res, next) => {
    const { nama, email, password, konfirmasiPassword } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    try {
        validationResult(req).throw();
        const createUser = await userModel.create({
            nama: nama,
            email: email,
            password: hashPassword,
        });

        
        return res.status(201).json({
            msg: "Berhasil registrasi",
            data: {
                id: createUser.id,
                nama: createUser.nama,
                email: createUser.email
            }
        });

    } catch (error) {
        return res.status(400).json({ error: error.mapped() });
    }
});

module.exports = router;