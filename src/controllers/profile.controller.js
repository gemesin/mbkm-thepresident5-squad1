const express = require('express');
const { validationResult } = require('express-validator');
const { userModel } = require('../models');
const { validationProfile } = require('../middlewares/profile.validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtOptions = {secretOrKey: 'secret'};
const passport = require('passport');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, '../user_images/'); // Menyimpan file di folder 'uploads/'
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); // Nama file diubah agar unik
  }
});
const upload = multer({ storage: storage });
const router = express.Router();

router.use(passport.authenticate('jwt', {session: false}));
router.use(upload.single('imagePath'));
 

router.get('/profile/userprofile/:id', validationProfile, async (req, res) => {
  const imagePath = req.file ? `../user_images/${req.file.filename}` : null;
  try {
    // Pastikan req.user sudah diatur oleh middlewareAutentikasi
    const profile = await userModel.findOne({ where: { id: req.params.id } });
    if (!profile) {
      return res.status(404).json({ msg: 'Profil tidak ditemukan' });
    }

    // Kirim data profil sebagai respons JSON
    return res.status(200).json({
      data: {
      id: profile.id,
      nama: profile.nama,
      email: profile.email,
      imagePath: profile.imagePath, 
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Terjadi kesalahan dalam mengambil data profil' });
  }
});

router.put('/profile/edituser/:id', validationProfile, async (req, res) => {
  const imagePath = req.file ? `../user_images/${req.file.filename}` : null;
  
  // Validasi input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  // Mendapatkan ID dari request params
  const userId = req.params.id;
  
  // Mendapatkan data dari req.body
  const { nama, email, oldPassword, newPassword, confirmPassword } = req.body;

  // Mengubah data profil di database
  try {
    const profile = await userModel.findOne({ where: { id: userId } });

    if (!profile) {
      return res.status(404).json({ msg: 'Profil tidak ditemukan' });
    }
    if (nama) {
      await userModel.update({ nama }, { where: { id: userId } });
    }
    if (email) {
      await userModel.update({ email }, { where: { id: userId } });
    }
    if (oldPassword) {
      const isPasswordValid = bcrypt.compareSync(oldPassword, profile.password);
      if (!isPasswordValid) {
        return res.status(400).json({ msg: 'Password lama tidak sesuai' });
      }

    // Mengubah password
    if (newPassword && confirmPassword) {
      // Validasi kecocokan password baru dan konfirmasi password baru
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ msg: 'Konfirmasi password baru tidak sesuai' });
      }

      // Update password baru
      const hashedPassword = bcrypt.hashSync(newPassword, 10);
      await userModel.update({ password: hashedPassword }, { where: { id: userId } });
    }

    }
    // Mengedit profile picture
    if (imagePath) {
      const imagePath = 'user_image/' + imagePath.filename;
      await userModel.update({ imagePath }, { where: { id: userId} });
    }


    return res.status(200).json({ 
      msg: 'Profil berhasil diubah', 
      data: {
        id: profile.id,
        nama: nama,
        email: email,
        imagePath: imagePath,
        }
    
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Terjadi kesalahan dalam mengubah profil' });
  }
});

module.exports = router;

