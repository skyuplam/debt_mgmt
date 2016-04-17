export default function (sequelize, DataTypes) {
  const Portfolio = sequelize.define('portfolio', {
    description: {
      type: DataTypes.STRING,
    },
    referenceCode: {
      type: DataTypes.STRING,
      unique: true,
    },
    biddedAt: {
      type: DataTypes.DATEONLY,
    },
    cutoffAt: {
      type: DataTypes.DATEONLY,
    },
  }, {
    classMethods: {
      associate: models => {
        Portfolio.belongsTo(models.company);
        Portfolio.hasMany(models.loan);
      },
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return Portfolio;
}
