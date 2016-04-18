export default function (sequelize, DataTypes) {
  const Employer = sequelize.define('employer', {
    description: {
      type: DataTypes.STRING,
    }
  }, {
    classMethods: {
      associate: models => {
        Employer.belongsTo(models.person, { as: 'employee' });
        Employer.belongsTo(models.company);
      }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return Employer;
}
