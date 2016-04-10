export default function (sequelize, DataTypes) {
  const UserRole = sequelize.define('userRole', {
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    classMethods: {
      associate: models => {
        UserRole.belongsTo(models.user);
        UserRole.belongsTo(models.role);
      }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return UserRole;
}
