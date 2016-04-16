export default function (sequelize, DataTypes) {
  const CompanyType = sequelize.define('companyType', {
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
    //     CompanyType.belongsTo(models.province);
    //   }
    // },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return CompanyType;
}
