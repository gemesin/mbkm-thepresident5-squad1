const express = require("express")
const register = require("./src/routes/register.route")
const login = require("./src/routes/login.route")
const profile = require('./src/routes/profile.route');
const artikel = require('./src/routes/artikel.route');
const weather = require('./src/routes/weather.route');
const forum = require('./src/routes/forum.route');
const lms = require('./src/routes/lms.route');
const db = require("./src/models/index");
const passport = require('passport')

const app = express();

app.use(passport.initialize());

app.use(express.json());
app.use(register);
app.use(login);
app.use(profile);
app.use(artikel);
app.use(weather);
app.use(forum);
app.use(lms);

app.use('/uploads',express.static('uploads'));
app.use(express.static('src'))

require('dotenv').config();

const PORT = 8001;
const baseURL = 'http://localhost:8001';

db.sequelize
    .authenticate()
    .then(() => {
        console.log('Koneksi ke database berhasil.');
    })
    .catch(err => {
        console.error('Gagal koneksi ke database: ', err);
});

app.listen(PORT, () => {
    console.log(`api started at ${baseURL}`);
});

app.get('/', (req, res) => {
    res.status(200).json({msg: "testing ke server"})
})


