export default function wordsModel(sequelize, DataTypes) {
  return sequelize.define(
    'words',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      word: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'categories',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    { underscored: true },
  );
}
