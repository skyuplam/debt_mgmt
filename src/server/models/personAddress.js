export default function (sequelize, DataTypes) {
  const PersonAddress = sequelize.define('personAddress', {
    verifiedAt: {
      type: DataTypes.DATE,
    },
    verifiedBy: {
      type: DataTypes.STRING,
    }
  }, {
    classMethods: {
      associate: models => {
        PersonAddress.belongsTo(models.county);
        PersonAddress.belongsTo(models.person);
        PersonAddress.belongsTo(models.address);
        PersonAddress.belongsTo(models.source);
      }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return PersonAddress;
}
