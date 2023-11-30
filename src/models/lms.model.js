module.exports = (sequelize, Sequelize) => {
    const Lms = sequelize.define("lms", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        title: {
            type: Sequelize.STRING,
        },
        cover: {
            type: Sequelize.STRING
        },
        section: {
            type: Sequelize.INTEGER
        },
        view: {
            type: Sequelize.INTEGER
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('NOW()'),
        }
    });
    
    return Lms;
}