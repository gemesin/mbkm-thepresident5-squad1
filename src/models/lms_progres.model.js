module.exports = (sequelize, Sequelize) => {
    const Progres = sequelize.define("user_progres", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        id_user: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        id_lms: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        id_section: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        progres: {
            type: Sequelize.BOOLEAN,
        },
    });

    return Progres;
}