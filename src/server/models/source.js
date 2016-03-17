export default function (sequelize, DataTypes) {
  const Source = sequelize.define('source', {
    source: {
      type: DataTypes.STRING,
      unique: true
    },
    description: {
      type: DataTypes.STRING,
    },
  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return Source;
}
