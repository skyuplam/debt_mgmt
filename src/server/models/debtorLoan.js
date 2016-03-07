export default function (sequelize, DataTypes) {
  const DebtorLoan = sequelize.define('debtorLoan', {
    isPrimary: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    // classMethods: {
    //   associate: models => {
    //     DebtorLoan.belongsTo(models.province);
    //   }
    // },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return DebtorLoan;
}
