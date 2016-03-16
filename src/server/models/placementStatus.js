export default function (sequelize, DataTypes) {
  const PlacementStatus = sequelize.define('placementStatus', {
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

  return PlacementStatus;
}
