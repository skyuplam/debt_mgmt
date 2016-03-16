export default function (sequelize, DataTypes) {
  const LoanPlacement = sequelize.define('loanPlacement', {
    startedAt: {
      type: DataTypes.DATEONLY,
    },
    endedAt: {
      type: DataTypes.DATEONLY,
    },
  }, {
    classMethods: {
      associate: models => {
        LoanPlacement.belongsTo(models.placementStatus);
      },
      hook: models => {
        // Init Placement Status to New
        LoanPlacement.afterCreate((placement, opts) => {
          return models.placementStatus.findOne({
            where: {
              status: 'Placed'
            }
          }, {
            transaction: opts.transaction
          }).then(placementStatus =>
            placement.setPlacementStatus(placementStatus, {
              transaction: opts.transaction
            })
          );
        });
      }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return LoanPlacement;
}
