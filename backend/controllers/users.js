const router = require('express').Router()
const bcrypt = require('bcrypt')
const tokenExtractor = require('../middleware/tokenExtractor')

const { User, Note, Following } = require('../models')

router.get('/', async (req, res) => {

  const includeOptions = [
    {
      model: Note,
      attributes: { exclude: ['userId']}
    },
    {
      model: User,
      as: 'Following',
      attributes: ['id', 'username', 'name'],
      through: { attributes: [] }
    },
    {
      model: User,
      as: 'Followers',
      attributes: ['id', 'username', 'name'],
      through: { attributes: [] }
    }
  ]

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
  const includeOptions = [
    {
      model: Note,
      attributes: { exclude: ['userId'] },
      required: false
    },
    {
      model: User,
      as: 'Following',
      attributes: ['id', 'username', 'name'],
      through: { attributes: [] }
    },
    {
      model: User,
      as: 'Followers',
      attributes: ['id', 'username', 'name'],
      through: { attributes: [] }
    }
  ]

  // Apply public filter only to notes
  if (req.query.public === 'true') {
    includeOptions[0].where = { private: false }
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

router.post('/follow/:id', tokenExtractor, async (req, res) => {
  try {
    const currentUserId = req.decodedToken.id 
    const userToFollowId = req.params.id

    if (currentUserId === parseInt(userToFollowId)) {
      return res.status(400).json({ error: "you can't follow yourself!" })
    }

    const userToFollow = await User.findByPk(userToFollowId)

    if (!userToFollow) {
      return res.status(404).json({ error: 'user not found '})
    }

    const follow = await Following.create({
      userId: currentUserId,
      followedUserId: userToFollowId
    })

    return res.status(201).json(follow)

  } catch (error) {
    // Handle duplicate follow error
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Already following this user' })
    }
    return res.status(400).json({ error: error.message })
  }
})

router.delete('/unfollow/:id', tokenExtractor, async (req, res) => {
  try {
    const currentUserId = req.decodedToken.id
    const userToUnfollowId = req.params.id

    if (currentUserId === parseInt(userToUnfollowId)) {
      return res.status(400).json({ error: "You can't unfollow yourself" })
    }

    const userToUnfollow = await User.findByPk(userToUnfollowId)
    if (!userToUnfollow) {
      return res.status(404).json({ error: 'User not found' })
    }

    const result = await Following.destroy({
      where: {
        userId: currentUserId,
        followedUserId: userToUnfollowId  // Use the ID, not the object
      }
    })

    // result is the number of rows deleted (0 or 1)
    if (result === 0) {
      return res.status(400).json({ error: 'You are not following this user' })
    }

    res.status(204).end()
    
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

module.exports = router