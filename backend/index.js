require('dotenv').config()
const { Sequelize, Model, QueryTypes, DataTypes } = require('sequelize')

//this turns things into a web application
const express = require('express')
const app = express()
app.use(express.json());

const sequelize = new Sequelize(process.env.DATABASE_URL)

// const main = async () => {
//   try {
//     await sequelize.authenticate()
//     console.log('Connection has been established successfully.')
//     const notes = await sequelize.query("SELECT * FROM notes", { type: QueryTypes.SELECT })
//     console.log(notes)
//     sequelize.close()
//   } catch (error) {
//     console.error('Unable to connect to the database:', error)
//   }
// }
// 
// main()

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
    type: DataTypes.INTEGER
  }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'note'
  })

Note.sync()

app.get('/api/notes', async (req, res) => {
  const notes = await Note.findAll()
  console.log(JSON.stringify(notes, null, 2))
  res.json(notes)
})

app.post('/api/notes', async (req, res) => {
  console.log(req.body)
  try {
    const note = await Note.create(req.body)
    return res.json(note)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

app.get('/api/notes/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/notes/:id', async (req, res) => {
  try {
    await Note.destroy({
      where: {
        id: req.params.id
      }
    })
    res.status(204).end()
  } catch (error) {
    res.status(404).end()
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

