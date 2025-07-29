const router = require('express').Router()
const { Note } = require('../models')

router.get('/', async (req, res) => {
  const notes = await Note.findAll()
  console.log(JSON.stringify(notes, null, 2))
  res.json(notes)
})

router.post('/', async (req, res) => {
  console.log(req.body)
  try {
    const note = await Note.create(req.body)
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