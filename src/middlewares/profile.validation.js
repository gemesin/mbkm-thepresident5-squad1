const { body } = require('express-validator');
const { userModel } = require('../models');

const validationProfile = [
  body('nama').trim().optional().notEmpty().withMessage('Username tidak boleh kosong'),
  body('email')
    .isEmail()
    .optional()
    .withMessage('Format email harus benar')
    .custom(async (email, { req }) => {
      if (!req.params.id) {
        throw new Error('Data tidak ditemukan');
      }

    if (email) {  // Validasi hanya jika email diisi
      const existingUser = await userModel.findOne({
        where: {
          email: email,
        },
      });

      if (existingUser) {
        throw new Error('Email sudah digunakan');
      }
    }
  }),

  body('oldPassword').if((value, { req }) => req.body.newPassword || req.body.confirmPassword)
  .notEmpty()
  .withMessage('Password lama tidak boleh kosong'),
 
  body('newPassword')
    .trim()
    .if((value, { req }) => req.body.newPassword || req.body.confirmPassword)
    .notEmpty().withMessage('Password baru tidak boleh kosong')
    .isLength({ min: 8 }).withMessage('Password baru harus minimal 8 karakter')
    .matches(/[\W_]/).withMessage('Password baru harus mengandung minimal 1 simbol'),
  
  body('confirmPassword').custom((value, { req }) => {
    if (value && value !== req.body.newPassword) {
      throw new Error('Konfirmasi password baru tidak sesuai');
    }
    return true;
  }),
];

module.exports = { validationProfile };
