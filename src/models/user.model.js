module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        nama: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
        },
        password: {
            type: Sequelize.STRING
        },
        photo: {
            type: Sequelize.STRING,
            defaultValue: '/user_img/'
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('NOW()'),
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('NOW()'),
        },
    
    });

    return User;
}