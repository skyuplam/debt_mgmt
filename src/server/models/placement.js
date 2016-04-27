export default function (sequelize, DataTypes) {
  const Placement = sequelize.define('placement', {
    placementCode: {
      type: DataTypes.STRING,
      unique: true,
    },
    servicingFeeRate: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    placedAt: {
      type: DataTypes.DATE,
    },
    expectedRecalledAt: {
      type: DataTypes.DATE,
    },
    recalledAt: {
      type: DataTypes.DATE,
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
