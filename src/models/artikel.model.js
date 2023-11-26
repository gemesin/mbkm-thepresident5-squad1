module.exports = (sequelize, Sequelize) => {
    const Artikel = sequelize.define("artikel", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        title: {
            type: Sequelize.STRING,
        },
        deskripsi: {
            type: Sequelize.TEXT,
        },
        isi: {
            type: Sequelize.TEXT,
        },
        pembuat: {
            type: Sequelize.STRING,
        },
        cover: {
            type: Sequelize.STRING
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('NOW()'),
        },
    });

    return Artikel;
}