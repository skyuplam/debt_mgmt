export default function(sequelize, DataTypes) {
  var IdentityType = sequelize.define('idType', {
    idType: {
      type: DataTypes.STRING,
    }
  },{
    // classMethods: {
    //   associate: models => {
    //     IdentityType.belongsTo(models.province);
    //   }
    // },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return IdentityType;
}
