export default function (sequelize, DataTypes) {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notNull: true,
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    }
  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return User;
}
