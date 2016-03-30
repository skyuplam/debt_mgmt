export default function (sequelize, DataTypes) {
  const Note = sequelize.define('note', {
    note: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: models => {
        Note.belongsTo(models.person);
      }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return Note;
}
