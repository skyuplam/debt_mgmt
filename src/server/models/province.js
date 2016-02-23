export default function (sequelize, DataTypes) {
  const Province = sequelize.define('province', {
    province: {
      type: DataTypes.STRING,
    }
  }, {
    classMethods: {
      associate: models => {
        Province.belongsTo(models.country);
        Province.hasMany(models.city);
      }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return Province;
}
