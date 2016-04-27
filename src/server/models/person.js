export default function (sequelize, DataTypes) {
  const Person = sequelize.define('person', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING,
    },
    maritalStatus: {
      type: DataTypes.STRING,
    },
    dob: {
      type: DataTypes.DATE,
    }
  }, {
    classMethods: {
      associate: models => {
        Person.belongsToMany(models.identity, { through: 'personIdentity' });
        Person.belongsToMany(models.loan, {
          through: models.debtorLoan,
        });
        Person.hasMany(models.personContactNumber);
        Person.hasMany(models.personAddress);
      }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return Person;
}
