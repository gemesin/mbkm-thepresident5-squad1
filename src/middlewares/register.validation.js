const { body } = require("express-validator");
const { userModel } = require("../models");

const checkValidasi = [
    body("nama")
        .notEmpty().withMessage("wajib diisi"),
    body("email")
        .notEmpty().withMessage("wajib diisi")
        .isEmail().withMessage("format harus benar")
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
        .notEmpty().withMessage("wajib diisi")
        .isLength({ min: 8 }).withMessage("minimal 8 karakter")
        .matches(/[\W_]/).withMessage("minimal 1 simbol")
];

module.exports = checkValidasi;
