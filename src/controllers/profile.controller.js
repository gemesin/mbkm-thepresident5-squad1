const express = require('express');
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

const { validationResult } = require('express-validator');
const { userModel } = require('../models');
const { validationProfile } = require('../middlewares/profile.validation');
const { validationPass } = require('../middlewares/password.validation');

const router = express.Router();
const baseURL = "http://195.35.32.179:8001";

router.use(passport.authenticate('jwt', { session: false }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationPath = path.resolve(__dirname, '..', 'user_img');
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    cb(null, "user" + req.user.id + '-profile' + path.extname(file.originalname));
  }
});

const multerFilter = (req, file, cb) => {
  let ext = path.extname(file.originalname);
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
    req.fileValidationError = "Foto hanya bisa png, jpg atau jpeg";
    return cb(null, false, req.fileValidationError);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: multerFilter
});

const uploadPhoto = upload.single('photo');

router.get('/profile/user-profile', validationProfile, async (req, res) => {
  const userId = req.user;
  try {
    const profile = await userModel.findOne({ where: { id: userId.id } });
    if (!profile) {
      return res.status(404).json({ msg: 'Profil tidak ditemukan' });
    }
    return res.status(200).json({
      nama: profile.nama,
      email: profile.email,
      photo: profile.photo,
    });
  } catch (error) {
    return res.status(500).json({ msg: 'Terjadi kesalahan dalam mengambil data profil' });
  }
});

router.put('/profile/edit-profile', uploadPhoto, validationProfile, async (req, res) => {
  const userId = req.user;
  const nama = req.body.nama;
  let checkPerubahan = false;
  const imagePath = req.file ? `${baseURL}/user_img/${req.file.filename}` : null;

  const errors = validationResult(req);
  if (!errors.isEmpty() || req.fileValidationError) {
    return res.status(400).json({ errors: errors.array(), cover: req.fileValidationError });
  }
  // Menangani kesalahan multer
  if (req.fileValidationError) {
    return res.status(400).json({ message: req.fileValidationError });
  }

  try {
    const profile = await userModel.findOne({ where: { id: userId.id } });

    // Mengedit nama
    if (nama) {
      await userModel.update({ nama }, { where: { id: userId.id } });
      checkPerubahan = true;
    }

    // Mengedit profile picture
    if (imagePath) {
      await userModel.update({ photo: imagePath }, { where: { id: userId.id } });
      checkPerubahan = true;
    }

    const oldPath = path.join(__dirname, '..', 'user_img', profile.photo);

    if (fs.existsSync(oldPath) && profile.userId === userId.id) {
      fs.unlink(oldPath, (err) => {
      });
    }

    if (checkPerubahan) {
      return res.status(200).json({
        msg: "Profil berhasil diubah"
      });
    } else {
      return res.json({ msg: "" });
    }
  } catch (error) {
    return res.status(500).json({ msg: 'Terjadi kesalahan dalam mengubah profil' });
  }
});


router.put('/profile/edit-pass', validationPass, async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const user = req.user;
  const salt = bcrypt.genSaltSync(10);

  const errors = validationResult(req);

  const userPass = await userModel.findOne({ where: { id: user.id } })
  const isPasswordValid = bcrypt.compareSync(oldPassword, userPass.password);

  if (!isPasswordValid) {
    return res.status(400).json({ msg: "Kata sandi tidak sesuai" });
  }

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  const hashPassword = bcrypt.hashSync(newPassword, salt);
  await userModel.update({ password: hashPassword }, { where: { id: user.id } });

  return res.json({ msg: "Kata sandi berhasil diubah" });

})

module.exports = router;
