export default function (sequelize, DataTypes) {
  const County = sequelize.define('county', {
    county: {
      type: DataTypes.STRING,
    }
  }, {
    classMethods: {
      associate: models => {
        County.belongsTo(models.city);
      }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return County;
}
