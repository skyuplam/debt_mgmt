export default function (sequelize, DataTypes) {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return User;
}
