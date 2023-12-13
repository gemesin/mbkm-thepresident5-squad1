module.exports = (sequelize, Sequelize) => {
    const Likes = sequelize.define("likes", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        id_post: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        id_user: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        isLike: {
            type: Sequelize.BOOLEAN
        }
    });

    return Likes;
}