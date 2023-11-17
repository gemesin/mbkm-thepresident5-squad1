module.exports = (sequelize, Sequelize) => {
    const Weather = sequelize.define("weather", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        longitude: {
            type: Sequelize.FLOAT, // Corrected data type
        },
        latitude: {
            type: Sequelize.FLOAT, // Corrected data type
        },
        current_temperature: {
            type: Sequelize.FLOAT, // Corrected data type
        },
        current_pressure: {
            type: Sequelize.FLOAT, // Corrected data type
        },
        current_humidity: {
            type: Sequelize.FLOAT, // Corrected data type
        },
        current_wind_speed: {
            type: Sequelize.FLOAT, // Corrected data type
        },
        current_wind_direction: {
            type: Sequelize.FLOAT, // Corrected data type
        },
        daily_temperature: {
            type: Sequelize.ARRAY(Sequelize.FLOAT), // Array of numbers
        },
        weekly_temperature: {
            type: Sequelize.ARRAY(Sequelize.FLOAT), // Array of numbers
        },
        icon: {
            type: Sequelize.STRING,
        },
    });

    return Weather;
}