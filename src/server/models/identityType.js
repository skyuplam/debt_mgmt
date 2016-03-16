export default function (sequelize, DataTypes) {
  const IdentityType = sequelize.define('identityType', {
    type: {
      type: DataTypes.STRING,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
    }
  }, {
    // classMethods: {
    //   associate: models => {
    //     IdentityType.belongsTo(models.province);
    //   }
    // },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return IdentityType;
}
