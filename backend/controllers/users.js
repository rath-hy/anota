const router = require('express').Router()
const bcrypt = require('bcrypt')

const { User, Note } = require('../models')

router.get('/', async (req, res) => {

  const includeOptions = {
    model: Note,
    attributes: { exclude: ['userId']}
  }

  const users = await User.findAll({
    include: includeOptions
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  try {
    const { username, name, password } = req.body
    
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newUser = {
      username,
      name,
      email,
      passwordHash,
    }

    console.log('new user', newUser)

    const user = await User.create(newUser)

    res.status(201).json(user)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.get('/:id', async (req, res) => {
  const includeOptions = {
    model: Note,
    attributes: { exclude: ['userId']},
    required: false
  }

  console.log('query', req.query)

  if (req.query.public === 'true') {
    includeOptions.where = { private: false }
  }

  const user = await User.findByPk(req.params.id, {
    include: includeOptions
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router