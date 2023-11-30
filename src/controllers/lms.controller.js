const express = require('express');
const passport = require('passport');
const { Op } = require('sequelize');

const { userModel, lmsModel, sectionModel, progresModel } = require('../models/');

const router = express.Router();
router.use(passport.authenticate('jwt', { session: false }));

router.get('/lms', async (req, res) => {
    const user = req.user;
    const dataUser = await userModel.findOne({
        where: { id: user.id }
    });
    const dataLms = await lmsModel.findAll();
    const topViewLms = await lmsModel.findAll({
        order: [['view', 'DESC']],
        limit: 5
    });

    if (!dataUser) {
        return res.status(404).json({ msg: 'User tidak ditemukan' })
    }
    if (dataLms.length === 0) {
        return res.status(404).json({ msg: 'Modul tidak tersedia' })
    }

    return res.json({
        msg: "Berhasil mendapatkan user dan modul",
        user: {
            nama: dataUser.nama,
            photo: dataUser.photo
        },
        "rekomendasi": topViewLms,
        modul: dataLms
    });
})

router.get('/lms/progres', async (req, res) => {
    const user = req.user;
    const dataUserProgress = await lmsModel.findAll({
        attributes: ['id', 'title', 'section', 'cover'],
        include: [{
            model: progresModel,
            where: { id_user: user.id },
            attributes: [ 'id_section','progres'],
        }]
    })
    const progresResults = dataUserProgress.map(lms => {
        const totalSections = lms.section;
        const completedSections = lms.user_progres.filter(section => section.progres === true).length;
        const progres = totalSections > 0 ? (completedSections / totalSections) * 100 : 0;
        return {
            id: lms.id,
            title: lms.title,
            cover: lms.cover,
            "total section": lms.section,
            progres: progres
        };
    });

    if (dataUserProgress.length === 0) {
        return res.status(404).json({ msg: 'Belum ada modul yang anda ikuti' })
    }

    return res.json({
        msg: "Modul berhasil didapatkan",
        progres: progresResults
    })
})

router.get('/lms/lesson/:id', async (req, res) => {
    const lmsId = req.params.id;
    const userId = req.user;
    try {
        await lmsModel.increment('view', { where: { id: lmsId } });

        const dataSection = await sectionModel.findAll({
            where: { id_lms: lmsId },
            attributes: ['id_section', 'section'],
        })

        const lessonById = await lmsModel.findOne({
            where: { id: lmsId },
            attributes: ['cover', 'title', 'section']
        })

        const progresUser = await progresModel.findAll({
            where: { id_user: userId.id, id_lms: lmsId },
            attributes: ['progres', 'id_section']
        })

        if (dataSection.length === 0 && !lessonById) {
            return res.status(404).json({ msg: "Lesson tidak ditemukan" })
        }

        const progressMap = {};
        progresUser.forEach(progress => {
            progressMap[progress.id_section] = progress.progres;
        });

        const sectionsWithProgress = dataSection.map(section => ({
            id_section: section.id_section,
            section: section.section,
            progres: progressMap[section.id_section] || null,
        }));

        return res.json({
            msg: "Lesson ditemukan",
            lesson: lessonById,
            section: sectionsWithProgress
        })
    } catch (error) {
        return res.status(500).json({ msg: "Terjadi kesalahan dalam mengambil data lesson" });
    }

})

router.get('/lms/lesson/:lessonId/section/:sectionId', async (req, res) => {
    const lessonId = req.params.lessonId;
    const sectionId = req.params.sectionId;

    try {
        const dataSection = await sectionModel.findOne({
            where: { id_lms: lessonId, id_section: sectionId },
        });

        if (!dataSection) {
            return res.status(404).json({ msg: "Section tidak ditemukan" });
        }

        return res.json({
            msg: "Section ditemukan",
            data: dataSection
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Terjadi kesalahan dalam mengambil data section" });
    }
});

router.put('/lms/lesson/:lessonId/section/:sectionId', async (req, res) => {
    const lessonId = req.params.lessonId;
    const sectionId = req.params.sectionId;
    const { isDone } = req.body;
    const userId = req.user.id;

    try {
        const dataSection = await sectionModel.findOne({
            where: { id_lms: lessonId, id_section: sectionId },
        });

        if (!dataSection) {
            return res.status(404).json({ msg: "Section tidak ditemukan" });
        }

        const checkProgres = await progresModel.findAll({
            where: {
                id_user: userId,
                id_lms: lessonId,
                id_section: sectionId
            }
        })

        if (checkProgres.length > 0) {
            return res.status(404).json({ msg: "Progres section sudah tersimpan" });
        }

        const updateProgres = await progresModel.create({
            id_user: userId,
            id_lms: lessonId,
            id_section: sectionId,
            progres: isDone
        })

        if (!updateProgres) {
            return res.json({ msg: "Gagal menyimpan progres" })
        }
        return res.status(201).json({
            msg: "Progres anda telah tersimpan",
            data: updateProgres
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Terjadi kesalahan dalam mengambil data section" });
    }
});

router.get('/lms/find', async (req,res) => {
    const {search} = req.query;

    if(!search){
        return res.status(400).json({msg: "Silahkan masukkan kata kunci terlebih dahulu"})
    }


    const findModul = await lmsModel.findAll({
        where: {
            title: {
                [Op.like]:`%${search}%`
            }
        }
    })

    if(findModul.length === 0){
        return res.status(404).json({msg: "Modul tidak ditemukan"})
    }

    return res.json({
        msg: "Modul ditemukan",
        data: findModul
    })
})

router.post('/lms/add', async (req,res) => {
    const {title, cover, section} = req.body;

    const addModul = await lmsModel.create({
        title: title,
        cover: cover,
        section: section
    })

    return res.json({
        data: addModul
    })
})
module.exports = router;