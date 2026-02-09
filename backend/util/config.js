require('dotenv').config()

if (!process.env.SECRET) {
  throw new Error('SECRET environment variable must be defined');
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable must be defined');
}

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 3001,
  SECRET: process.env.SECRET,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173'
}