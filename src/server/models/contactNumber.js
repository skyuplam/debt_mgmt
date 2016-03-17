export default function (sequelize, DataTypes) {
  const ContactNumber = sequelize.define('contactNumber', {
    contackNumber: {
      type: DataTypes.STRING,
    },
    countryCode: {
      type: DataTypes.STRING,
    },
    areaCode: {
      type: DataTypes.STRING,
    },
    ext: {
      type: DataTypes.STRING,
    },
  }, {
    classMethods: {
      associate: models => {
        ContactNumber.belongsTo(models.contactNumberType);
        ContactNumber.hasMany(models.personContactNumber);
      }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return ContactNumber;
}
