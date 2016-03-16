export default function (sequelize, DataTypes) {
  const LoanStatus = sequelize.define('loanStatus', {
    status: {
      type: DataTypes.STRING,
      unique: true,
    },
    code: {
      type: DataTypes.STRING,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
    }
  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return LoanStatus;
}
