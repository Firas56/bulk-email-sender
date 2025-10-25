'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Template extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Template.belongsTo(models.User, { foreignKey: 'userId' });
      Template.hasMany(models.Campaign, { foreignKey: 'templateId' });
    }
    
  }
  Template.init({
    name: DataTypes.STRING,
    subject: DataTypes.STRING,
    body: DataTypes.TEXT,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Template',
  });
  return Template;
};