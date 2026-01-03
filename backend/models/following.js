const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Following extends Model {}

Following.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  followedUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'following',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'followed_user_id']
    }
  ]
})

module.exports = Following