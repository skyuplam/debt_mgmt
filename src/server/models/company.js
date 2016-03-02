export default function (sequelize, DataTypes) {
  const Company = sequelize.define('company', {
    name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    }
  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return Company;
}
