const express = require('express');
const {forumModel} = require('../models/');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const passport = require('passport');

const router = express.Router();

router.use(passport.authenticate('jwt', {session: false}));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationPath = path.resolve(__dirname, '..', 'covers_forum');
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    cb(null, "forum" + Date.now() + '-cover' + path.extname(file.originalname)); 
  }
});

const multerFilter = (req, file, cb) => {
   
  if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) { 
     return cb(new Error('Foto hanya bisa png atau jpg'))
   }
 cb(null, true)

};

const upload = multer({ 
  storage: storage,
  fileFilter: multerFilter 
});
router.use(upload.single('cover'));

router.get('/forum', async (req,res) => {

    const getAllPost = await forumModel.findAll();
    
    if(getAllPost.length === 0){
        return res.status(404).json({
            msg: "Postingan tidak ditemukan"
        });
    }
    
    return res.json({
        msg: "Postingan ditemukan",
        data: getAllPost
    })
})

router.post('/forum/new-post', async (req,res) => {
    const {title, content} = req.body;
    const userId = req.user;
    const coverPath = req.file ? `../covers_forum/${req.file.filename}` : null;

    const newPost = await forumModel.create({
        title: title,
        id_user: userId.id,
        content: content,
        cover: coverPath
    })

    if(!newPost){
        return res.status(400).json({msg: "Postingan gagal dibuat"})
    }

    return res.status(201).json({
        msg: "Postingan berhasil dibuat",
        data: newPost
    })
})
module.exports = router;