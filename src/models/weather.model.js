module.exports = (sequelize, Sequelize) => {
    const Weather = sequelize.define("weather", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        nama: {
            type: Sequelize.STRING
        },
        icon: {
            type: Sequelize.STRING,
        },
        path: {
            type: Sequelize.STRING,
        },
    });

    return Weather;
}