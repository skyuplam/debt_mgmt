export default function (sequelize, DataTypes) {
  const Person = sequelize.define('person', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    maritalStatus: {
      type: DataTypes.STRING,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: models => {
        Person.hasOne(models.city, { as: 'censusRegisteredCity' });
        Person.belongsToMany(models.identity, { through: 'personIdentity' });
      }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return Person;
}
