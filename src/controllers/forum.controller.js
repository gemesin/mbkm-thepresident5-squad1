const express = require('express');
const { forumModel, commentModel, userModel, likesModel } = require('../models/');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const passport = require('passport');
const { forumValidation } = require('../middlewares/forum.validation');
const { commentValidation } = require('../middlewares/comment.validation');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const Sequelize = require('sequelize');

const router = express.Router();
const baseURL = 'http://195.35.32.179:8001';

router.use(passport.authenticate('jwt', { session: false }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationPath = path.resolve(__dirname, '..' , 'covers_forum');
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    cb(null, "forum" + Date.now() + '-cover' + path.extname(file.originalname));
  }
});

const multerFilter = (req, file, cb) => {
  let ext = path.extname(file.originalname);
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
    req.fileValidationError = "Foto hanya bisa png, jpg atau jpeg";
    return cb(null, false, req.fileValidationError);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: multerFilter
});

const uploadCover = upload.single('cover');

router.get('/forum', async (req, res) => {
  try {
    const userId = req.user.id;

    const getAllPost = await forumModel.findAll({
      include: [
        {
          model: userModel,
          as: 'created_by',
          where: { id: Sequelize.col('forum.id_user') },
          attributes: ['nama', 'photo']
        },
        {
          model: likesModel,
          as: 'likes',
          where: {
            id_user: userId
          },
          attributes: ['isLike'],
          required: false
        }
      ]
    });

    if (getAllPost.length === 0) {
      return res.status(404).json({
        msg: "Postingan tidak ditemukan"
      });
    }

    const modifiedPosts = getAllPost.map(post => {
      const likes = post.likes.length > 0 ? post.likes[0].isLike : false;
      return {
        ...post.toJSON(),
        likes
      };
    });
    
    return res.json({
      msg: "Postingan ditemukan",
      data: modifiedPosts
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Terjadi kesalahan dalam mengambil data postingan",
    });
  }
});


router.post('/forum/new-post', uploadCover, forumValidation, async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user;
  const coverPath = req.file ? `${baseURL}/covers_forum/${req.file.filename}` : null;

  const errors = validationResult(req);
  if (!errors.isEmpty() || req.fileValidationError) {
    return res.status(400).json({ errors: errors.array(), cover: req.fileValidationError });
  }

  const newPost = await forumModel.create({
    id_user: userId.id,
    title: title,
    content: content,
    cover: coverPath
  })

  if (!newPost) {
    return res.status(400).json({ msg: "Postingan gagal dibuat" })
  }


  return res.status(201).json({
    msg: "Postingan berhasil dibuat",
    user: userId.nama,
    data: newPost,
  })
})

router.get('/forum/:id', async (req, res) => {
  const postId = req.params.id;

  try {
    const getPostById = await forumModel.findOne({
      where: { id: postId },
      include: [
        {
          model: userModel,
          as: "created_by",
          attributes: ['nama', 'photo']
        },
        {
          model: likesModel,
          as: 'likes',
          where: {
            id_user: req.user.id
          },
          attributes: ['isLike'],
          required: false
        },
        {
          model: commentModel,
          as: 'comment',
          include: [
            {
              model: userModel,
              as: 'user',
              attributes: ['nama', 'photo']
            }
          ]
        }
      ]
    });

    if (!getPostById) {
      return res.status(404).json({ msg: 'Postingan tidak ditemukan' });
    }

    const likes = getPostById.likes.length > 0 ? getPostById.likes[0].isLike : false;
    const modifiedPost = {
      ...getPostById.toJSON(),
      likes
    };

    return res.json({
      msg: "Berhasil mendapatkan postingan",
      data: modifiedPost
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
});


router.post("/forum/:id/comment/", commentValidation, async (req, res) => {
  const { text } = req.body;
  const postId = req.params.id;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const checkPost = await forumModel.findOne({
      where: { id: postId }
    })

    if (!checkPost) {
      return res.status(404).json({ msg: "Postingan tidak ditemukan" })
    }

    const newComment = await commentModel.create({
      id_post: postId,
      id_user: req.user.id,
      text: text,
    });

    if (!newComment) {
      return res.status(400).json({ msg: "Komentar gagal ditambahkan" });
    }

    return res.status(201).json({
      msg: "Komentar berhasil ditambahkan",
      data: newComment
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Terjadi kesalahan dalam menambahkan komentar" });
  }
});

router.put('/forum/:id/unlike', async (req, res) => {
  const postId = req.params.id;

  const checkPost = await forumModel.findOne({
    where: { id: postId }
  })

  if (!checkPost) {
    return res.status(404).json({ msg: "Postingan tidak ditemukan" })
  }

  const postUnlike = await likesModel.destroy({
    where: {
      id_post: postId,
      id_user: req.user.id,
    },
  });

  if (!postUnlike) {
    return res.status(400).json({ msg: "Anda sudah unlike postingan ini" });
  }

  return res.json({
    msg: "Unlike berhasil"
  });
});


router.post('/forum/:id/like', async (req, res) => {
  const postId = req.params.id;
  const { isLike } = req.body;

  const checkPost = await forumModel.findOne({
    where: { id: postId }
  });

  if (!checkPost) {
    return res.status(404).json({ msg: "Postingan tidak ditemukan" });
  }

  const existingLike = await likesModel.findOne({
    where: {
      id_post: postId,
      id_user: req.user.id,
    }
  });

  if (existingLike) {
   
    await existingLike.update({ isLike: isLike });
    return res.json({ msg: `post like ${isLike}` });
  } else {
   
    const newLike = await likesModel.create({
      id_post: postId,
      id_user: req.user.id,
      isLike: isLike
    });

    return res.json({
      msg: "like post",
      data: newLike
    });
  }
});


router.get('/forum/posts/find', async (req, res) => {
  const { search } = req.query;

  if (!search) {
    return res.status(400).json({ msg: 'Silahkan masukkan kata kunci' });
  }

  const result = await forumModel.findAll({
    where: {
      [Op.or]: [
        {
          title: {
            [Op.like]: `%${search}%`
          }
        },
        {
          content: {
            [Op.like]: `%${search}%`
          }
        }
      ]
    },
    include: [{
      model: userModel,
      as: 'created_by',
      attributes: ['nama', 'photo', 'createdAt']
    }]
  });

  if (result.length === 0) {
    return res.status(404).json({ msg: 'Postingan tidak ditemukan' })
  }

  return res.json({
    msg: 'Postingan ditemukan',
    data: result
  })

})

module.exports = router;