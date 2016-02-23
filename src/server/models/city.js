export default function (sequelize, DataTypes) {
  const City = sequelize.define('city', {
    city: {
      type: DataTypes.STRING,
    }
  }, {
    classMethods: {
      associate: models => {
        City.belongsTo(models.province);
      }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return City;
}
