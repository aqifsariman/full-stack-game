export default function usersModel(sequelize, DataTypes) {
  return sequelize.define(
    'users',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      username: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: { args: true, msg: 'username already in use' },
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          isEmail: {
            args: true,
            msg: 'valid email-id required',
          },
        },
        unique: { args: true, msg: 'email address already in use' },
      },
      password: {
        type: DataTypes.TEXT,
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
