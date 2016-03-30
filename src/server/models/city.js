export default function (sequelize, DataTypes) {
  const City = sequelize.define('city', {
    city: {
      type: DataTypes.STRING,
    }
  }, {
    classMethods: {
      associate: models => {
        City.belongsToMany(models.province, {
          through: 'provinceCity'
        });
        City.belongsToMany(models.county, {
          through: models.cityCounty
        });
      }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return City;
}
