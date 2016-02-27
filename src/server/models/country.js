export default function (sequelize, DataTypes) {
  const Country = sequelize.define('country', {
    country: {
      type: DataTypes.STRING,
    }
  }, {
    classMethods: {
      associate: models => {
        Country.hasMany(models.city, { as: 'municipality' });
        Country.hasMany(models.province);
      }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return Country;
}
