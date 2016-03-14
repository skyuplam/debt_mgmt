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
        RepaymentPlan.belongsTo(models.repaymentPlanStatus);
        RepaymentPlan.belongsTo(models.loan);
      },
      hook: models => {
        // Init RepaymentPlan Status to New
        RepaymentPlan.afterCreate((repaymentPlan, opts) => {
          return models.repaymentPlanStatus.findOne({
            where: {
              status: 'New'
            }
          }, {
            transaction: opts.transaction
          }).then(repaymentPlanStatus =>
            repaymentPlan.setRepaymentPlanStatus(repaymentPlanStatus, {
              transaction: opts.transaction
            })
          );
        });
      }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return RepaymentPlan;
}
