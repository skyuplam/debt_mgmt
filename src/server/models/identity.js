export default function (sequelize, DataTypes) {
  const Identity = sequelize.define('identity', {
    idNumber: {
      type: DataTypes.STRING,
    },
    issueDate: {
      type: DataTypes.DATEONLY,
    },
    expiredDate: {
      type: DataTypes.DATEONLY,
    }
  }, {
    classMethods: {
      associate: models => {
        Identity.belongsTo(models.identityType);
        Identity.belongsTo(models.city, { as: 'censusRegisteredCity' });
        Identity.belongsTo(models.city, { as: 'issueAuthority' });
        Identity.belongsToMany(models.person, { through: 'personIdentity' });
      }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return Identity;
}
