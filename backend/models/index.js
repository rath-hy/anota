const Note = require('./note')
const User = require('./user')
const Following = require('./following')

User.hasMany(Note)
Note.belongsTo(User)

// Define the self-referential many-to-many relationship
User.belongsToMany(User, {
  through: Following,
  as: 'Following',           // User.getFollowing() - users I follow
  foreignKey: 'userId',       // My ID
  otherKey: 'followedUserId'  // Their ID
})

User.belongsToMany(User, {
  through: Following,
  as: 'Followers',            // User.getFollowers() - users who follow me
  foreignKey: 'followedUserId', // My ID (I'm being followed)
  otherKey: 'userId'            // Their ID (they follow me)
})

module.exports = {
  Note, 
  User,
  Following  // Add this so you can import it elsewhere if needed
}