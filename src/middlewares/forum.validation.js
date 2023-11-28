const { body } = require('express-validator');
const { userModel } = require('../models');

const forumValidation = () => {
  return [
    body('title').notEmpty().withMessage('Judul tidak boleh kosong'),
    body('content').notEmpty().withMessage('Wajib diisi'),
  ];
};

module.exports = {forumValidation};