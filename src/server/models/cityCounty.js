export default function (sequelize, DataTypes) {
  const CityCounty = sequelize.define('cityCounty', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return CityCounty;
}
