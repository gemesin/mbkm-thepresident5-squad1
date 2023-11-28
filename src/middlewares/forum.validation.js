const { body } = require('express-validator');
const { userModel } = require('../models');

const forumValidation = [
    body('title').notEmpty().withMessage('Judul tidak boleh kosong'),
    body('content').notEmpty().withMessage('Konten tidak boleh kosong'),
  ]

module.exports = {forumValidation};