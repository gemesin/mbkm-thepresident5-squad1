const { body } = require('express-validator');
const { userModel } = require('../models');

const validationProfile = [
  body('nama')
    .trim()
    .optional({ nullable: true, checkFalsy: true })
    .isLength({min: 6}).withMessage('Nama minimal 6 kata'),
  body('email')
    .isEmail().withMessage('Format email harus benar')
    .custom(async (email, { req }) => {
      const existingUser = await userModel.findOne({
          where: {
              email: email
          }
      });
      if (existingUser) {
          throw new Error("Email sudah digunakan");
      }
    })
    .bail() 
    .optional({ nullable: true, checkFalsy: true })
];

module.exports = { validationProfile };
