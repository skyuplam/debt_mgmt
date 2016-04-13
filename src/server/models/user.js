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
    },
    lastLoginAt: {
      type: DataTypes.DATE,
    },
    lastLoginIP: {
      type: DataTypes.STRING,
    },
    currentLoginAt: {
      type: DataTypes.DATE,
    },
    currentLoginIP: {
      type: DataTypes.STRING,
    },
    loginCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
  }, {
    classMethods: {
      associate: models => {
        User.belongsToMany(models.role, {
          through: models.userRole
        });
      },
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return User;
}
