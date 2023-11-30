module.exports = (sequelize, Sequelize) => {
    const Section = sequelize.define("lms_section", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        id_lms: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        id_section: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        section: {
            type: Sequelize.STRING,
        },
        content: {
            type: Sequelize.TEXT
        },
        cover: {
            type: Sequelize.STRING
        }

    });

    return Section;
}