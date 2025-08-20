const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Note extends Model {}
Note.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }, 
  username: {
    type: DataTypes.TEXT
  },
  private: {
    type: DataTypes.BOOLEAN
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'note'
})

module.exports = Note