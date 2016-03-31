export default function (sequelize, DataTypes) {
  const PersonAddress = sequelize.define('personAddress', {
    contactPerson: {
      type: DataTypes.STRING,
    },
    verifiedAt: {
      type: DataTypes.DATE,
    },
    verifiedBy: {
      type: DataTypes.STRING,
    }
  }, {
    classMethods: {
      associate: models => {
        PersonAddress.belongsTo(models.person);
        PersonAddress.belongsTo(models.address);
        PersonAddress.belongsTo(models.addressType);
        PersonAddress.belongsTo(models.source);
        PersonAddress.belongsTo(models.relationship);
      }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return PersonAddress;
}
