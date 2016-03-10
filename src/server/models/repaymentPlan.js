export default function (sequelize, DataTypes) {
  const RepaymentPlan = sequelize.define('repaymentPlan', {
    principal: {
      type: DataTypes.FLOAT,
    },
    apr: {
      type: DataTypes.FLOAT,
    },
    servicingFeeRate: {
      type: DataTypes.FLOAT,
    },
    managementFeeRate: {
      type: DataTypes.FLOAT,
    },
    lateFeeRate: {
      type: DataTypes.FLOAT,
    },
    penaltyFeeRate: {
      type: DataTypes.FLOAT,
    },
    terms: {
      type: DataTypes.INTEGER,
    },
    startedAt: {
      type: DataTypes.DATEONLY,
    },
    endedAt: {
      type: DataTypes.DATEONLY,
    }
  }, {
    classMethods: {
      associate: models => {
        RepaymentPlan.hasMany(models.repayment);
        RepaymentPlan.belongsTo(models.loan);
      }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return RepaymentPlan;
}
