'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('campaigns', 'recipientIds', {
      type: Sequelize.JSON,
      allowNull: true,
      comment: 'Array of recipient IDs to send to. If null, sends to all valid recipients.'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('campaigns', 'recipientIds');
  }
};
