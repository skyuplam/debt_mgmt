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
    terms: {
      type: DataTypes.FLOAT,
    },
    expectedRepaidAt: {
      type: DataTypes.DATEONLY,
    },
    repaidAt: {
      type: DataTypes.DATE,
    }
  }, {
    classMethods: {
      associate: models => {
        Repayment.belongsTo(models.repaymentStatus);
      }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return Repayment;
}
