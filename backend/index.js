const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors') 
const app = express()

const { PORT, FRONTEND_URL } = require('./util/config')
const { connectToDatabase, sequelize } = require('./util/db')

const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const teamsRouter = require('./controllers/teams')

// Configure Firebase based on environment
// if (process.env.NODE_ENV === 'development') {
//   // Development - use emulator
//   process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099'
//   admin.initializeApp({
//     projectId: 'anota-by-puthyrathy'
//   })
// } 
// else {
  // Production - use service account
  const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'anota-by-puthyrathy'
  })
// }

// Configure CORS to allow requests from frontend
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

app.use(express.json());

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/teams', teamsRouter)

const start = async () => {
  await connectToDatabase()

  await sequelize.sync({ alter: { drop: false } })

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()