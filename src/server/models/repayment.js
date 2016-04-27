export default function (sequelize, DataTypes) {
  const Repayment = sequelize.define('repayment', {
    principal: {
      type: DataTypes.FLOAT,
    },
    interest: {
      type: DataTypes.FLOAT,
    },
    servicingFee: {
      type: DataTypes.FLOAT,
    },
    managementFee: {
      type: DataTypes.FLOAT,
    },
    lateFee: {
      type: DataTypes.FLOAT,
    },
    penaltyFee: {
      type: DataTypes.FLOAT,
    },
    term: {
      type: DataTypes.INTEGER,
    },
    expectedRepaidAt: {
      type: DataTypes.DATE,
    },
    paidAmount: {
      type: DataTypes.FLOAT,
    },
    repaidAt: {
      type: DataTypes.DATE,
    }
  }, {
    classMethods: {
      associate: models => {
        Repayment.belongsTo(models.repaymentStatus);
      },
      hook: models => {
        // Init Repayment Status to New
        Repayment.afterCreate((repayment, opts) =>
          models.repaymentStatus.findOne({
            where: {
              status: 'New'
            }
          }, {
            transaction: opts.transaction
          }).then(repaymentStatus =>
            repayment.setRepaymentStatus(repaymentStatus, {
              transaction: opts.transaction
            })
          )
        );
      }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return Repayment;
}
