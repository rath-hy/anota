const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = require('express').Router()
const admin = require('firebase-admin')

const { SECRET } = require('../util/config')
const User = require('../models/user')

router.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({
    where: {
      username
    }
  })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  response
    .status(200)
    .send({ token, username: user.username, id: user.id })
    // .send({ token, username: user.username, name: user.name })
})

router.post('/google', async (request, response) => {
  console.log('GOOGLE ROUTE HIT!')

  try {
    const { idToken } = request.body
    console.log('id token', idToken)
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    console.log('decoded token', decodedToken)
    const { email, name, uid, picture } = decodedToken

    let user = await User.findOne({ where: { email }})

    if (!user) {
      const username = email.split('@')[0] + uid.slice(0, 6)
      user = await User.create({
        username,
        name: name || email, 
        email,
        photoUrl: picture,
        passwordHash: null
      })
    }

    const userForToken = {
      username: user.username,
      id: user.id
    }

    const token = jwt.sign(userForToken, SECRET)

    response.status(200).send({
      token,
      username: user.username,
      id: user.id,
      name: user.name,
      photoUrl: picture
    })
  } catch (error) {
    console.error('Google login error:', error)
    response.status(401).json({ error: 'invalid token' })
  }
})



module.exports = router