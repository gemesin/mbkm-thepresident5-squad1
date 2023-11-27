const dbConfig = require("../config/database.config");

const Sequelize = require("sequelize");
const artikelModel = require("./artikel.model");
const forumModel = require("./forum.model");

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.DIALECT,
        port: dbConfig.PORT,
        define: {
            timestamps: false,
            freezeTableName: true
        },
        logging: true
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.userModel = require("./user.model")(sequelize, Sequelize);
db.artikelModel = require('./artikel.model')(sequelize, Sequelize);
db.weatherModel = require('./weather.model')(sequelize, Sequelize);
db.forumModel = require('./forum.model')(sequelize, Sequelize);
db.commentModel = require('./comment.model')(sequelize, Sequelize);
db.likesModel = require('./likes.model')(sequelize, Sequelize);

//relasi untuk tabel
db.forumModel.hasMany(db.commentModel, { as: 'comment', foreignKey: 'id_post' });
db.commentModel.belongsTo(db.userModel, {as: 'user', foreignKey: "id_user"})
db.forumModel.hasMany(db.likesModel, { as: 'likes', foreignKey: 'id_post' });
db.likesModel.belongsTo(db.forumModel, { foreignKey: 'id_post' });

module.exports = db;