const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { userModel } = require("../models");
const passport = require('../config/passport')
const jwtOptions = {secretOrKey: 'secret'};

const router = express.Router();

router.post("/login",  async (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        const dataUser = await userModel.findOne({ where: { email: email } });
        if (!dataUser) {
            return res.status(401).json({ message: 'Email atau kata sandi invalid' });
        }

        const userPassword = dataUser.password;
        // Membandingkan password yang diberikan oleh pengguna dengan hash password dalam database
        const isMatch = bcrypt.compareSync(password, userPassword);
        if (isMatch) {
            let payload = { id: dataUser.id, email: dataUser.email };
            let token = jwt.sign(payload, jwtOptions.secretOrKey);
            
            return res.json({ 
                msg: 'Berhasil login', 
                token: token 
            });
        
        } else {
            return res.status(401).json({ msg: 'Email atau kata sandi invalid' });
        }
    }
    
});


module.exports = router;