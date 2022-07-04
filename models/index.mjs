import { Sequelize } from 'sequelize';
import allConfig from '../config/config.js';

// ----- MODELS ----- //
import usersModel from './users.mjs';
import categoriesModel from './categories.mjs';
import wordsModel from './words.mjs';
import statsModel from './stats.mjs';

const env = process.env.NODE_ENV || 'development';

const config = allConfig[env];

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

// ----- Models Relationship ----- //
db.User = usersModel(sequelize, Sequelize.DataTypes);
db.Category = categoriesModel(sequelize, Sequelize.DataTypes);
db.Word = wordsModel(sequelize, Sequelize.DataTypes);
db.Stats = statsModel(sequelize, Sequelize.DataTypes);

db.Stats.belongsTo(db.User);
db.User.hasMany(db.Stats);

db.Word.belongsTo(db.Category);
db.Category.hasMany(db.Word);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
