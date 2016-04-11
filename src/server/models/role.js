export default function (sequelize, DataTypes) {
  const Role = sequelize.define('role', {
    role: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
    }
  }, {
    classMethods: {
      associate: models => {
        Role.belongsToMany(models.user, {
          through: models.userRole
        });
      }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return Role;
}
