import User from '../model/user.js'
import Event from '../model/event.js'
import EventParticipant from '../model/eventParticipant.js'
import Invitation from '../model/invitation.js'
import Friend from '../model/friend.js'

// User → Events creados (1:N)
User.hasMany(Event, { foreignKey: 'creatorId', as: 'createdEvents' })
Event.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' })

// User ↔ Event many-to-many a través de EventParticipant
User.belongsToMany(Event, {
  through: EventParticipant,
  foreignKey: 'userId',
  otherKey: 'eventId',
  as: 'participatingEvents',
})
Event.belongsToMany(User, {
  through: EventParticipant,
  foreignKey: 'eventId',
  otherKey: 'userId',
  as: 'participants',
})

// Asociaciones directas de EventParticipant para poder hacer includes sin pasar por belongsToMany
EventParticipant.belongsTo(User, { foreignKey: 'userId', as: 'user' })
EventParticipant.belongsTo(User, { foreignKey: 'invitedBy', as: 'inviter' })
EventParticipant.belongsTo(Event, { foreignKey: 'eventId', as: 'event' })
Event.hasMany(EventParticipant, {
  foreignKey: 'eventId',
  as: 'eventParticipants',
  onDelete: 'CASCADE',
})

// Invitations
Event.hasMany(Invitation, {
  foreignKey: 'eventId',
  as: 'invitations',
  onDelete: 'CASCADE',
})
Invitation.belongsTo(Event, { foreignKey: 'eventId', as: 'event' })
Invitation.belongsTo(User, { foreignKey: 'inviterId', as: 'inviter' })
Invitation.belongsTo(User, { foreignKey: 'invitedUserId', as: 'invitedUser' })

// Friends
User.hasMany(Friend, { foreignKey: 'requesterId', as: 'sentFriendRequests' })
User.hasMany(Friend, { foreignKey: 'addresseeId', as: 'receivedFriendRequests' })
Friend.belongsTo(User, { foreignKey: 'requesterId', as: 'requester' })
Friend.belongsTo(User, { foreignKey: 'addresseeId', as: 'addressee' })

export { User, Event, EventParticipant, Invitation, Friend }
