export default function (sequelize, DataTypes) {
  const Placement = sequelize.define('placement', {
    servicingFeeRate: {
      type: DataTypes.FLOAT,
    },
    managementFeeRate: {
      type: DataTypes.FLOAT,
    },
    startedAt: {
      type: DataTypes.DATEONLY,
    },
    endedAt: {
      type: DataTypes.DATEONLY,
    },
  }, {
    classMethods: {
      associate: models => {
        Placement.belongsTo(models.placementStatus);
      },
      hook: models => {
        // Init Placement Status to New
        Placement.afterCreate((placement, opts) => {
          return models.placementStatus.findOne({
            where: {
              status: 'Placed'
            }
          }, {
            transaction: opts.transaction
          }).then(placementStatus =>
            placement.setRepaymentPlanStatus(placementStatus, {
              transaction: opts.transaction
            })
          );
        });
      }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return Placement;
}
