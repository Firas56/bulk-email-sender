'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recipient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Recipient.belongsTo(models.User, { foreignKey: 'userId' });
      Recipient.hasMany(models.SendingHistory, { foreignKey: 'recipientId' });
    }
    
  }
  Recipient.init({
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    isValid: DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Recipient',
  });
  return Recipient;
};