const express = require('express');
const passport = require('passport');
const multer = require('multer');

const { validationResult } = require('express-validator');
const { userModel } = require('../models');
const { validationProfile } = require('../middlewares/profile.validation');

const router = express.Router();


router.use(passport.authenticate('jwt', {session: false}));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, '../user_img/'); // Menyimpan file di folder 'uploads/'
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); // Nama file diubah agar unik
  }
});

const upload = multer({ storage: storage });
router.use(upload.single('images'));

router.get('/profile/user-profile', validationProfile, async (req, res) => {
  const userId = req.user;
  console.log(userId.id)
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

router.put('/profile/edit-profile', validationProfile, async (req, res) => {
  const userId = req.user;
  const { nama, email, photo } = req.body;
  const imagePath = req.file ? `../user_img/${req.file.filename}` : null;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  try {
    const profile = await userModel.findOne({ where: { id: userId.id} });

    // Mengedit nama
    if (nama) {
      await userModel.update({ nama }, { where: { id: userId.id } });
      return res.json({msg: 'Username berhasil diubah'});
    }
    
    // Mengedit email 
    if (email) {
      const existingUser = await userModel.findOne({ where: { email } });
      if (existingUser && existingUser.id !== userId.id) {
        return res.status(400).json({ msg: 'Email sudah digunakan' });
      }
      await userModel.update({ email }, { where: { id: userId.id } });
      const updatedUser = await userModel.findOne({ where: { id: userId.id } });
    }
    
    // Mengedit profile picture
    if (imagePath) {
      await userModel.update({ photo: imagePath }, { where: { id: userId.id} });
      return res.send('Foto profil berhasil diubah');
    }
    
    return res.status(200).json({ msg: 'Tidak ada perubahan yang dilakukan pada profil' });
  
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Terjadi kesalahan dalam mengubah profil' });
  }
});

module.exports = router;
