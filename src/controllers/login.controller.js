const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { userModel } = require("../models");
const jwtOptions = {
    secretOrKey: 'kelompok-1-jayajayajaya'
};

const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        const dataUser = await userModel.findOne({ where: { email: email } });
        if (!dataUser) {
            return res.status(401).json({ message: 'Email atau password invalid' });
        }

        const userPassword = dataUser.password;

        // Membandingkan password yang diberikan oleh pengguna dengan hash password dalam database
        const isMatch = bcrypt.compareSync(password, userPassword);
        if (isMatch) {
            let payload = { id: dataUser.id };
            let token = jwt.sign(payload, jwtOptions.secretOrKey);
            return res.json({ 
                msg: 'Berhasil login', 
                token: token 
            });
        } else {
            return res.status(401).json({ msg: 'Email atau password invalid' });
        }
    }
});


module.exports = router;