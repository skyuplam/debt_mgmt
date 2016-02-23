export default function(sequelize, DataTypes) {
  var Address = sequelize.define('address', {
    address: {
      type: DataTypes.STRING,
    },
    postalCode: {
      type: DataTypes.STRING,
    }
  },{
    classMethods: {
      associate: models => {
        Address.belongsTo(models.county);
      }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return Address;
}
