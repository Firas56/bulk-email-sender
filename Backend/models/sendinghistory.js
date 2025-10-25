'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SendingHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SendingHistory.belongsTo(models.Campaign, { foreignKey: 'campaignId' });
      SendingHistory.belongsTo(models.Recipient, { foreignKey: 'recipientId' });
    }
    
  }
  SendingHistory.init({
    campaignId: DataTypes.INTEGER,
    recipientId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    sentAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'SendingHistory',
  });
  return SendingHistory;
};