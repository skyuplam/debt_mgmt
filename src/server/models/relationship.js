export default function (sequelize, DataTypes) {
  const PersonContactNumber = sequelize.define('relationship', {
    relationship: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    }
  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return PersonContactNumber;
}
