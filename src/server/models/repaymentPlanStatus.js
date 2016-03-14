export default function (sequelize, DataTypes) {
  const RepaymentPlanStatus = sequelize.define('repaymentPlanStatus', {
    status: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    }
  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return RepaymentPlanStatus;
}
