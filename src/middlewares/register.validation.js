const { body } = require("express-validator");
const { userModel } = require("../models");

const checkValidasi = [
    body("nama")
        .notEmpty().withMessage("Nama wajib diisi"),
    body("email")
        .notEmpty().withMessage("Email wajib diisi")
        .isEmail().withMessage("Format email harus benar")
        .custom(async (email, { req }) => {
            const existingUser = await userModel.findOne({
                where: {
                    email: email
                }
            });
            if (existingUser) {
                throw new Error("Email sudah digunakan");
            }
        }),
    body("password")
        .notEmpty().withMessage("Kata sandi wajib diisi")
        .isLength({ min: 8 }).withMessage("Kata sandi minimal 8 karakter")
        .matches(/[\W_]/).withMessage("Kata sandi minimal 1 simbol"),
    body('konfirmasiPassword')
        .custom((value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Kata sandi tidak sama');
          }
          return true;
        }),
];

module.exports = checkValidasi;
