const express = require("express")
const register = require("./src/routes/register.route")
const login = require("./src/routes/login.route")
const db = require("./src/models/index");
const passport = require('passport')

const app = express();

app.use(express.json());
app.use(register);
app.use(login);
app.use(passport.initialize());

const PORT = 3000;

db.sequelize
    .authenticate()
    .then(() => {
        console.log('Koneksi ke database berhasil.');
    })
    .catch(err => {
        console.error('Gagal koneksi ke database: ', err);
});

app.listen(PORT, () => {
    console.log(`api started at ${PORT}`);
});



