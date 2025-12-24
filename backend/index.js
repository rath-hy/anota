const admin = require('firebase-admin')

const express = require('express')
const cors = require('cors') 
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase, sequelize } = require('./util/db')

const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

// Set emulator before initializing
process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099'

admin.initializeApp({
  projectId: 'anota-by-puthyrathy'
})

app.use(cors());
app.use(express.json());

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

const start = async () => {
  await connectToDatabase()

  await sequelize.sync({ alter: true })

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()

