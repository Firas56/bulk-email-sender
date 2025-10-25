'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Campaign extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Campaign.belongsTo(models.User, { foreignKey: 'userId' });
        Campaign.belongsTo(models.Template, { foreignKey: 'templateId' });
        Campaign.hasMany(models.SendingHistory, { foreignKey: 'campaignId' });
      
    }
  }
  Campaign.init({
    name: DataTypes.STRING,
    templateId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    scheduledAt: DataTypes.DATE,
    sentAt: DataTypes.DATE,
    recipientIds: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Campaign',
  });
  return Campaign;
};