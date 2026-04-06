const Note = require('./note')
const User = require('./user')
const Following = require('./following')
const Team = require('./team')
const TeamMember = require('./teamMember')

User.hasMany(Note)
Note.belongsTo(User)

// Self-referential follow relationship
User.belongsToMany(User, {
  through: Following,
  as: 'Following',
  foreignKey: 'userId',
  otherKey: 'followedUserId'
})

User.belongsToMany(User, {
  through: Following,
  as: 'Followers',
  foreignKey: 'followedUserId',
  otherKey: 'userId'
})

// Team relationships
Team.belongsTo(User, { as: 'creator', foreignKey: 'creatorId' })
User.hasMany(Team, { as: 'createdTeams', foreignKey: 'creatorId' })

Team.belongsToMany(User, {
  through: TeamMember,
  as: 'members',
  foreignKey: 'teamId',
  otherKey: 'userId'
})

User.belongsToMany(Team, {
  through: TeamMember,
  as: 'teams',
  foreignKey: 'userId',
  otherKey: 'teamId'
})

// Notes can optionally belong to a team
Note.belongsTo(Team, { foreignKey: 'teamId', as: 'team' })
Team.hasMany(Note, { foreignKey: 'teamId', as: 'notes' })

module.exports = {
  Note,
  User,
  Following,
  Team,
  TeamMember
}