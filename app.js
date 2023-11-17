const express = require("express")
const register = require("./src/routes/register.route")
const login = require("./src/routes/login.route")
const auth = require('./src/routes/auth.route');
const artikel = require('./src/routes/artikel.route');
const weather = require('./src/routes/weather.route');
const db = require("./src/models/index");
const passport = require('passport')

const app = express();

app.use(passport.initialize());

app.use(express.json());
app.use(register);
app.use(login);
app.use(auth);
app.use(artikel);
app.use(weather);


const PORT = 8001;

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

app.get('/', (req, res) => {
    res.status(200).json({msg: "testing ke server"})
})


app.use(express.static('src'))