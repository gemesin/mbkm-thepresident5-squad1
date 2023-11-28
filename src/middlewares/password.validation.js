const { body } = require('express-validator');
const { userModel } = require('../models');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

const validationPass = [
  body('oldPassword')
    .notEmpty().withMessage('kata sandi lama tidak boleh kosong'),
  body('newPassword')
    .notEmpty().withMessage('kata sandi baru tidak boleh kosong')
    .isLength({ min: 8 }).withMessage('kata sandi baru harus minimal 8 karakter')
    .matches(/[\W_]/).withMessage('kata sandi baru harus mengandung minimal 1 simbol'),
  body('confirmPassword')
    .notEmpty().withMessage('kata sandi baru tidak boleh kosong')
    .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
        throw new Error('Konfirmasi kata sandi baru tidak sesuai');
        }
        return true;
    }),
];

module.exports = { validationPass };
