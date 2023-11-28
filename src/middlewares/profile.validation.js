const { check } = require('express-validator');

const validationProfile = [
  check('nama')
    .trim()
    .optional({ nullable: true, checkFalsy: true })
    .isLength({min: 6}).withMessage('Nama minimal 6 kata')
];

module.exports = { validationProfile };
