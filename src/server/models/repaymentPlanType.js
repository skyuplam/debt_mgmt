export default function (sequelize, DataTypes) {
  const RepaymentPlanType = sequelize.define('repaymentPlanType', {
    type: {
      type: DataTypes.STRING,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
    }
  }, {
    // classMethods: {
    //   associate: models => {
    //     RepaymentPlanType.belongsTo(models.province);
    //   }
    // },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return RepaymentPlanType;
}
