export default function (sequelize, DataTypes) {
  const UserRole = sequelize.define('userRole', {
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return UserRole;
}
