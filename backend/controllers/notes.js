const router = require('express').Router()
const { Note, User } = require('../models')
const tokenExtractor = require('../middleware/tokenExtractor')

router.get('/', async (req, res) => {
  const includeOptions = {
    model: User,
    attributes: ['id', 'username']
  }

  const where = {}

  if (req.query.url) {
    where.url = req.query.url
  }

  if (req.query.publicOnly === 'true') {
    where.private = false
  }

  const notes = await Note.findAll({
    where,
    attributes: { exclude: ['userId'] },
    include: includeOptions
  })
  console.log(JSON.stringify(notes, null, 2))
  res.json(notes)
})

router.post('/', tokenExtractor, async (req, res) => {
  console.log(req.body)
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const note = await Note.create({...req.body, userId: user.id, date: new Date()})
    return res.json(note)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.get('/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)

  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', async (req, res) => {
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

module.exports = router