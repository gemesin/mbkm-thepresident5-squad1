const dbConfig = require("../config/database.config");

const Sequelize = require("sequelize");

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
        logging: true,
        dialectOptions: {
            useUTC: false,
        },
        timezone: '+07:00'
    }
    
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.userModel = require("./user.model")(sequelize, Sequelize);
db.artikelModel = require('./artikel.model')(sequelize, Sequelize);
db.weatherModel = require('./weather.model')(sequelize, Sequelize);
//forum
db.forumModel = require('./forum.model')(sequelize, Sequelize);
db.commentModel = require('./comment.model')(sequelize, Sequelize);
db.likesModel = require('./likes.model')(sequelize, Sequelize);
//lms
db.lmsModel = require('./lms.model')(sequelize, Sequelize);
db.sectionModel = require('./lms_section.model')(sequelize, Sequelize);
db.progresModel = require('./lms_progres.model')(sequelize, Sequelize);

//relasi forum
db.forumModel.hasMany(db.commentModel, { as: 'comment', foreignKey: 'id_post' });
db.commentModel.belongsTo(db.userModel, {as: 'user', foreignKey: "id_user"})
db.forumModel.hasMany(db.likesModel, { as: 'likes', foreignKey: 'id_post' });
db.likesModel.belongsTo(db.forumModel, { foreignKey: 'id_post' });
db.forumModel.belongsTo(db.userModel, {as: "created_by", foreignKey: 'id_user'})

//relasi lms
db.progresModel.belongsTo(db.lmsModel, {foreignKey: "id_lms"});
db.lmsModel.hasMany(db.progresModel, {foreignKey: 'id_lms'})

module.exports = db;