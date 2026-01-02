const router = require('express').Router()
const { Note, User } = require('../models')
const tokenExtractor = require('../middleware/tokenExtractor')
const { sequelize } = require('../util/db')
const { Op } = require('sequelize')

router.get('/', async (req, res) => {
  const includeOptions = {
    model: User,
    attributes: ['id', 'username', 'name']
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
    // attributes: { exclude: ['userId'] },
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

router.get('/urls', async (req, res) => {
  const search = req.query.search || ''

  const urls = await Note.findAll({
    attributes: [[sequelize.fn('DISTINCT', sequelize.col('url')), 'url' ]],
    where: {
      url: { [Op.iLike]: `%${search}`}
    },
    limit: 10
  })

  res.json(urls.map(n => n.url))
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

router.put('/:id', tokenExtractor, async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id)
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' })
    }

    // Check if the user owns this note
    if (note.userId !== req.decodedToken.id) {
      return res.status(403).json({ error: 'Permission denied' })
    }

    // Update the note with new data
    const updatedNote = await note.update(req.body)
    
    res.json(updatedNote)
  } catch (error) {
    console.error('Error updating note:', error)
    res.status(400).json({ error: error.message || 'Failed to update note' })
  }
})

module.exports = router