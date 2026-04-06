const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Note extends Model {}
Note.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  teamId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'teams',
      key: 'id'
    }
  }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'note'
})

module.exports = Note