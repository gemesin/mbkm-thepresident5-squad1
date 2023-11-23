const express = require('express');
const { validationResult } = require('express-validator');
const { userModel } = require('../models');
const { validationProfile } = require('../middlewares/profile.validation');

const router = express.Router();

router.get('/profile/userprofile/:id', validationProfile, async (req, res) => {
  try {
    const profile = await userModel.findOne({ where: { id: req.user.id } });
    if (!profile) {
      return res.status(404).json({ msg: 'Profil tidak ditemukan' });
    }

    // Kirim data profil sebagai respons JSON
    return res.status(200).json({
      username: profile.username,
      email: profile.email,
      photo: profile.photo,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Terjadi kesalahan dalam mengambil data profil' });
  }
});

router.put('/profile/edituser/:id', validationProfile, async (req, res) => {
  // Validasi input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Mendapatkan data dari req.body
  const { username, email, oldPassword, newPassword, confirmPassword, photo } = req.body;

  // Mengubah data profil di database
  try {
    const profile = await userModel.findOne({ where: { id: req.user.id } });

    // Mengedit username 
    if (username) {
      await userModel.update({ username }, { where: { id: req.user.id } });
      res.send('Username berhasil diubah');
    }

    // Mengedit email 
    if (email) {
      // Implementasi logika validasi email jika diperlukan
      const existingUser = await userModel.findOne({ where: { email } });
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(400).json({ msg: 'Email sudah digunakan' });
      }
      await Profile.update({ email }, { where: { id: req.user.id } });
      res.send('Email berhasil diubah');
    }

    // Mengedit password 
    if (oldPassword && newPassword && confirmPassword) {
      // Validasi kecocokan password lama
      if (profile.password !== oldPassword) {
        return res.status(400).json({ msg: 'Password lama tidak sesuai' });
      }

      // Validasi kecocokan password baru dan konfirmasi password baru
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ msg: 'Konfirmasi password baru tidak sesuai' });
      }

      // Update password baru
      await userModel.update({ password: newPassword }, { where: { id: req.user.id } });
      res.send('Password berhasil diubah');
    }

    // Mengedit foto profil jika ada
    if (photo) {
      await userModel.update({ photo }, { where: { id: req.user.id } });
      res.send('Foto profil berhasil diubah');
    }

    res.status(200).json({ msg: 'Profil berhasil diubah' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Terjadi kesalahan dalam mengubah profil' });
  }
});

module.exports = router;
