import { Sequelize } from 'sequelize';
import url from 'url';
import allConfig from '../config/config.js';

// ----- MODELS ----- //
import usersModel from './users.mjs';
import categoriesModel from './categories.mjs';
import wordsModel from './words.mjs';
import statsModel from './stats.mjs';

const env = process.env.NODE_ENV || 'development';

const config = allConfig[env];

const db = {};
let sequelize;

// const sequelize = new Sequelize(config.database, config.username, config.password, config);
// If env is production, retrieve database auth details from the
// DATABASE_URL env var that Heroku provides us
if (env === 'production') {
  // Break apart the Heroku database url and rebuild the configs we need
  const { DATABASE_URL } = process.env;
  const dbUrl = url.parse(DATABASE_URL);
  const username = dbUrl.auth.substr(0, dbUrl.auth.indexOf(':'));
  const password = dbUrl.auth.substr(dbUrl.auth.indexOf(':') + 1, dbUrl.auth.length);
  const dbName = dbUrl.path.slice(1);
  const host = dbUrl.hostname;
  const { port } = dbUrl;
  config.host = host;
  config.port = port;
  sequelize = new Sequelize(dbName, username, password, config);
}

// If env is not production, retrieve DB auth details from the config
else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

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
