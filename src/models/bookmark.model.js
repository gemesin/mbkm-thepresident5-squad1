module.exports = (sequelize, Sequelize) => {
    const Bookmark = sequelize.define("bookmark", {
        no: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        id_artikel: {
            type: Sequelize.INTEGER,
        },
        judul: {
            type: Sequelize.STRING
        },
        id_user: {
            type: Sequelize.INTEGER,
        },
    });

    return Bookmark;
}