export default function (sequelize, DataTypes) {
  const Placement = sequelize.define('placement', {
    placementCode: {
      type: DataTypes.STRING,
      unique: true,
    },
    servicingFeeRate: {
      type: DataTypes.FLOAT,
    },
    managementFeeRate: {
      type: DataTypes.FLOAT,
    },
    placedAt: {
      type: DataTypes.DATEONLY,
    },
    expectedReturnedAt: {
      type: DataTypes.DATEONLY,
    },
    returnedAt: {
      type: DataTypes.DATEONLY,
    },
  }, {
    classMethods: {
      associate: models => {
        Placement.belongsTo(models.company);
        Placement.belongsToMany(models.loan, {
          through: models.loanPlacement,
          foreignKey: 'placementId',
        });
      }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return Placement;
}
