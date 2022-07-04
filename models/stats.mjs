export default function leaderboardModel(sequelize, DataTypes) {
  return sequelize.define('stats', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      unique: true,
    },
    gamesPlayed: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    wordsCorrect: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    wordsWrong: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  });
}
