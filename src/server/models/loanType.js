export default function (sequelize, DataTypes) {
  const LoanType = sequelize.define('loanType', {
    type: {
      type: DataTypes.STRING,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
    }
  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return LoanType;
}
