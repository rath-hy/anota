const router = require('express').Router()
const { Team, TeamMember, User, Note } = require('../models')
const tokenExtractor = require('../middleware/tokenExtractor')

// Generate a short readable code like ABC-1234
const generateCode = () => {
  const letters = Math.random().toString(36).substring(2, 5).toUpperCase()
  const digits = Math.floor(1000 + Math.random() * 9000)
  return `${letters}-${digits}`
}

// GET /api/teams/mine — get all teams the current user belongs to
router.get('/mine', tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id, {
      include: [{
        model: Team,
        as: 'teams',
        through: { attributes: [] },
        include: [{ model: User, as: 'creator', attributes: ['id', 'username', 'name'] }]
      }]
    })
    res.json(user.teams)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST /api/teams — create a new team
router.post('/', tokenExtractor, async (req, res) => {
  try {
    const { name } = req.body
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Team name is required' })
    }

    // Generate a unique code
    let code, exists
    do {
      code = generateCode()
      exists = await Team.findOne({ where: { code } })
    } while (exists)

    const team = await Team.create({
      name: name.trim(),
      code,
      creatorId: req.decodedToken.id
    })

    // Auto-join the creator
    await TeamMember.create({ teamId: team.id, userId: req.decodedToken.id })

    const fullTeam = await Team.findByPk(team.id, {
      include: [{ model: User, as: 'creator', attributes: ['id', 'username', 'name'] }]
    })

    res.status(201).json(fullTeam)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// POST /api/teams/join — join a team by code
router.post('/join', tokenExtractor, async (req, res) => {
  try {
    const { code } = req.body
    if (!code) return res.status(400).json({ error: 'Code is required' })

    const team = await Team.findOne({ where: { code: code.trim().toUpperCase() } })
    if (!team) return res.status(404).json({ error: 'Team not found. Check the code and try again.' })

    // Check if already a member
    const existing = await TeamMember.findOne({
      where: { teamId: team.id, userId: req.decodedToken.id }
    })
    if (existing) return res.status(400).json({ error: 'You are already a member of this team' })

    await TeamMember.create({ teamId: team.id, userId: req.decodedToken.id })

    res.status(201).json({ teamId: team.id })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// GET /api/teams/:id/notes — get notes for a team, optionally filtered by userId
router.get('/:id/notes', tokenExtractor, async (req, res) => {
  try {
    // Verify requester is a member
    const membership = await TeamMember.findOne({
      where: { teamId: req.params.id, userId: req.decodedToken.id }
    })
    if (!membership) return res.status(403).json({ error: 'You are not a member of this team' })

    const where = { teamId: req.params.id }
    if (req.query.userId) {
      where.userId = req.query.userId
    }

    const notes = await Note.findAll({
      where,
      include: [{ model: User, attributes: ['id', 'username', 'name'] }],
      order: [['date', 'DESC']]
    })

    res.json(notes)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/teams/:id/members — get members of a team
router.get('/:id/members', tokenExtractor, async (req, res) => {
  try {
    const membership = await TeamMember.findOne({
      where: { teamId: req.params.id, userId: req.decodedToken.id }
    })
    if (!membership) return res.status(403).json({ error: 'You are not a member of this team' })

    const team = await Team.findByPk(req.params.id, {
      include: [{ model: User, as: 'members', attributes: ['id', 'username', 'name'], through: { attributes: [] } }]
    })

    res.json(team.members)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/teams/:id — team info with creator and members (members only)
router.get('/:id', tokenExtractor, async (req, res) => {
  try {
    const membership = await TeamMember.findOne({
      where: { teamId: req.params.id, userId: req.decodedToken.id }
    })
    if (!membership) return res.status(403).json({ error: 'You are not a member of this team' })

    const team = await Team.findByPk(req.params.id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username', 'name'] },
        { model: User, as: 'members', attributes: ['id', 'username', 'name'], through: { attributes: [] } }
      ]
    })
    if (!team) return res.status(404).json({ error: 'Team not found' })

    res.json(team)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/teams/:id — creator only: delete notes, memberships, then team
router.delete('/:id', tokenExtractor, async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id)
    if (!team) return res.status(404).json({ error: 'Team not found' })
    if (team.creatorId !== req.decodedToken.id) return res.status(403).json({ error: 'Only the creator can delete this team' })

    await Note.destroy({ where: { teamId: team.id } })
    await TeamMember.destroy({ where: { teamId: team.id } })
    await team.destroy()

    res.status(204).end()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/teams/:id/leave — non-creator members only
router.delete('/:id/leave', tokenExtractor, async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id)
    if (!team) return res.status(404).json({ error: 'Team not found' })
    if (team.creatorId === req.decodedToken.id) return res.status(400).json({ error: 'Creators cannot leave their own team. Delete it instead.' })

    const membership = await TeamMember.findOne({
      where: { teamId: team.id, userId: req.decodedToken.id }
    })
    if (!membership) return res.status(403).json({ error: 'You are not a member of this team' })

    await Note.destroy({ where: { teamId: team.id, userId: req.decodedToken.id } })
    await membership.destroy()

    res.status(204).end()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
