const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class TeamMember extends Model {}
TeamMember.init({
  teamId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'team_member',
  indexes: [
    { unique: true, fields: ['team_id', 'user_id'] }
  ]
})

module.exports = TeamMember
