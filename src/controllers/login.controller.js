const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { userModel } = require("../models");

const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        const dataUser = await new userModel({ email: email });
        if (!dataUser) {
          res.status(401).json({ message: 'Email atau password invalid' });
        }
        console.log(dataUser.email);
        if (dataUser.password === password) {
          let payload = { id: dataUser.id };
          let token = jwt.sign(payload, jwtOptions.secretOrKey);
          res.json({ msg: 'ok', token: token });
        } else {
          res.status(401).json({ msg: 'Email atau password invalid' });
        }
      }
});

module.exports = router;