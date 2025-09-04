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
      passwordHash
    }

    console.log(newUser)

    const user = await User.create(newUser)

    res.status(201).json(user)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

// router.get('/:id', async (req, res) => {
//   const requestedUserId = req.params.id
//   const currentUserId = req.decodedToken?.id

//   const user = await User.findByPk(req.params.id, {
//     include: {
//       model: Note,
//       where: currentUserId === requestedUserId ? {} : { private: false },
//       attributes: { exclude: ['userId']}
//     }
//   })
//   if (user) {
//     res.json(user)
//   } else {
//     res.status(404).end()
//   }
// })

router.get('/:id', async (req, res) => {
  const requestedUserId = req.params.id

  const user = await User.findByPk(req.params.id, {
    include: {
      model: Note,
      attributes: { exclude: ['userId']}
    }
  })
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router