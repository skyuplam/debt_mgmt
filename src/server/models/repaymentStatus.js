export default function (sequelize, DataTypes) {
  const RepaymentStatus = sequelize.define('repaymentStatus', {
    status: {
      type: DataTypes.STRING,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
    }
  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return RepaymentStatus;
}
