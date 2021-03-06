export default function (sequelize, DataTypes) {
  const Address = sequelize.define('address', {
    address: {
      type: DataTypes.STRING,
    },
    longAddress: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    classMethods: {
      associate: models => {
        Address.belongsTo(models.cityCounty);
        Address.hasMany(models.personAddress);
      }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return Address;
}
