export default function (sequelize, DataTypes) {
  const Agency = sequelize.define('agency', {
    servicingFeeRate: {
      type: DataTypes.FLOAT,
    },
    description: {
      type: DataTypes.STRING,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    classMethods: {
      associate: models => {
        Agency.belongsTo(models.company);
      },
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return Agency;
}
