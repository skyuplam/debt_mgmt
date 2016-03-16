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
    expectedRecalledAt: {
      type: DataTypes.DATEONLY,
    },
    recalledAt: {
      type: DataTypes.DATEONLY,
    },
  }, {
    classMethods: {
      associate: models => {
        Placement.belongsTo(models.company);
        Placement.hasMany(models.loanPlacement);
      }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return Placement;
}
