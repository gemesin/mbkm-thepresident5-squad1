module.exports = (sequelize, Sequelize) => {
    const Artikel = sequelize.define("artikel", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        cover: {
            type: Sequelize.STRING
        },
        judul: {
            type: Sequelize.STRING,
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('NOW()'),
        },
        deskripsi: {
            type: Sequelize.TEXT,
        },
    });

    return Artikel;
}