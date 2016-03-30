export default function (sequelize, DataTypes) {
  const County = sequelize.define('county', {
    county: {
      type: DataTypes.STRING,
    }
  }, {
    classMethods: {
      associate: models => {
        County.belongsToMany(models.city, {
          through: models.cityCounty
        });
      }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return County;
}
