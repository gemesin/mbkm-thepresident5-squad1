const { body } = require('express-validator');

const commentValidation = [
  body('text').notEmpty().withMessage('Komentar tidak boleh kosong'),
]  
module.exports = {commentValidation};