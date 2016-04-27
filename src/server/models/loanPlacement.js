export default function (sequelize, DataTypes) {
  const LoanPlacement = sequelize.define('loanPlacement', {
    refCode: {
      type: DataTypes.STRING,
      unique: true
    },
    expectedRecalledAt: {
      type: DataTypes.DATE,
    },
    returnedAt: {
      type: DataTypes.DATE,
    },
  }, {
    classMethods: {
      associate: models => {
        LoanPlacement.belongsTo(models.placementStatus);
        LoanPlacement.belongsTo(models.loan);
        LoanPlacement.belongsTo(models.placement);
      },
      hook: models => {
        // Init Placement Status to New
        LoanPlacement.afterCreate((placement, opts) =>
          models.placementStatus.findOne({
            where: {
              status: 'Placed'
            }
          }, {
            transaction: opts.transaction
          }).then(placementStatus =>
            placement.setPlacementStatus(placementStatus, {
              transaction: opts.transaction
            })
          )
        );
      }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return LoanPlacement;
}
