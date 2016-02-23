export default function (sequelize, DataTypes) {
  const Person = sequelize.define('person', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notNull: true,
      }
    },
    maritalStatus: {
      type: DataTypes.STRING,
    },
    dob: {
      type: DataTypes.STRING,
      validate: {
        notNull: true,
      }
    }
  }, {
    classMethods: {
      associate: models => {
        Person.hasOne(models.city, {as: 'censusRegisteredCity'});
        Person.belongsToMany(models.identity, {through: 'personIdentity'});
      }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return Person;
}
