const { check } = require('express-validator');
const { userModel } = require('../models');

const validationProfile = [
  check('nama')
    .trim()
    .optional({ nullable: true, checkFalsy: true })
    .isLength({min: 6}).withMessage('Nama minimal 6 kata'),
  check('photo')
    .custom((value, {req}) => {
      if (!req.file.originalname.match(/\.(png|jpg)$/)) {
        throw new Error('Foto hanya bisa png atau jpg');
      }
      return true;
    })
];

module.exports = { validationProfile };
