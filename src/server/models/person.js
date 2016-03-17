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
        Person.belongsToMany(models.loan, {
          through: models.debtorLoan,
          as: 'Loans',
          foreignKey: 'debtorId',
        });
        Person.hasMany(models.personContactNumber);
        Person.hasMany(models.personAddress);
      }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return Person;
}
