export default function (sequelize, DataTypes) {
  const PersonContactNumber = sequelize.define('personContactNumber', {
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
        PersonContactNumber.belongsTo(models.contactNumber);
        PersonContactNumber.belongsTo(models.person);
        PersonContactNumber.belongsTo(models.source);
        PersonContactNumber.belongsTo(models.company);
        PersonContactNumber.belongsTo(models.relationship);
      }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return PersonContactNumber;
}
